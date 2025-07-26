import pngToIco from 'png-to-ico';
import { NextRequest } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';
import { fileTypeFromBuffer } from 'file-type';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll("file") as File[];
  const targetFormat = formData.get("format") as string;

  if (!files.length || !targetFormat) {
    return new Response("Fichier ou format manquant", { status: 400 });
  }

  const supportedFormats = [
    "jpeg", "png", "webp", "tiff", "avif", "gif", "heif", "jp2", "jxl"
  ] as const;
  type SupportedFormat = (typeof supportedFormats)[number];

  const zip = new JSZip();

  await Promise.all(
    files.map(async (file, index) => {
      const arrayBuffer = await file.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      try {
        let converted: Buffer;
        let ext: string;

        if (targetFormat === 'ico') {
          const pngBuffer = await sharp(inputBuffer).png().toBuffer();
          converted = await pngToIco(pngBuffer);
          ext = 'ico';
        } else {
          if (!supportedFormats.includes(targetFormat as SupportedFormat)) {
            throw new Error("Format non supporté");
          }
          converted = await sharp(inputBuffer)
            .toFormat(targetFormat as unknown as sharp.AvailableFormatInfo)
            .toBuffer();
          ext = targetFormat;
        }

        const name = file.name.split(".")[0];
        zip.file(`${name}.${ext}`, converted);
      } catch (e) {
        console.error(`Erreur conversion ${file.name}`, e);
      }
    })
  );

  if (files.length === 1) {
    // Get the first (and only) file in the zip
    const fileEntry = Object.values(zip.files)[0];
    const content = await fileEntry.async("nodebuffer");
    const mimeType = targetFormat === "ico" ? "image/x-icon" : `image/${targetFormat}`;
    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename=converted.${targetFormat}`,
      },
    });
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new Response(zipBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=converted_images.zip`,
    },
  });
}