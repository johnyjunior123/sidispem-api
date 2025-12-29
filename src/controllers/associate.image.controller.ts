import {
    Controller,
    Get,
    Param,
    Res,
    NotFoundException,
} from "@nestjs/common";
import { type Response } from "express";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

@Controller("associates/image")
export class AssociateImageController {
    private s3: S3Client;

    constructor() {
        this.s3 = new S3Client({
            region: "auto",
            endpoint: process.env.ENDPOINT_URL,
            credentials: {
                accessKeyId: process.env.R2_KEY!,
                secretAccessKey: process.env.R2_KEY_SECRETS!,
            },
        });
    }

    @Get(":key")
    async getImage(
        @Param("key") key: string,
        @Res() res: Response
    ) {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: key,
            });
            const object = await this.s3.send(command);
            if (object.Body instanceof Readable) {
                object.Body.pipe(res);
            } else {
                const buffer = await new Response(object.Body as any).arrayBuffer();
                res.setHeader("Content-Type", object.ContentType || "image/jpeg");
                res.setHeader("Content-Disposition", "inline");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.send(Buffer.from(buffer));
            }
        } catch (err) {
            throw new NotFoundException("Imagem não encontrada");
        }
    }
}
