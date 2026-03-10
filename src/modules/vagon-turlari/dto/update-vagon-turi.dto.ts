import { PartialType } from "@nestjs/swagger";
import { CreateVagonTuriDto } from "./create-vagon-turi.dto";

export class UpdateVagonTuriDto extends PartialType(CreateVagonTuriDto) {}