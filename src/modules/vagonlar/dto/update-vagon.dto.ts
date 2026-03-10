import { PartialType } from "@nestjs/swagger";
import { Vagon } from "../entities/vagon.entity";

export class UpdateVagonDto extends PartialType(Vagon) {}