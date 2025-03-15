import { MigrationInterface, QueryRunner } from "typeorm";

export class  $QuestionManagement1742043592154 implements MigrationInterface {
    name = ' $QuestionManagement1742043592154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."upload_type_enum" AS ENUM('image')`);
        await queryRunner.query(`CREATE TABLE "upload" ("id" SERIAL NOT NULL, "name" character varying(1024) NOT NULL, "path" character varying(1024) NOT NULL, "type" "public"."upload_type_enum" NOT NULL DEFAULT 'image', "mime" character varying(128) NOT NULL, "size" character varying(1024) NOT NULL, "createDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1fe8db121b3de4ddfa677fc51f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."QuestionManagementTbl_questiontype_enum" AS ENUM('MCQ', 'DESCRIPTIVE')`);
        await queryRunner.query(`CREATE TABLE "QuestionManagementTbl" ("Id" uuid NOT NULL DEFAULT uuid_generate_v4(), "CreatedDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "UpdatedBy" character varying(150), "UpdatedDate" TIMESTAMP WITH TIME ZONE DEFAULT now(), "IsDeleted" boolean NOT NULL DEFAULT false, "questionType" "public"."QuestionManagementTbl_questiontype_enum" NOT NULL DEFAULT 'MCQ', "question" character varying NOT NULL, "answer 1" character varying, "answer 2" character varying, "answer 3" character varying, "answer 4" character varying, "descriptiveAnswer" character varying, "image_id" integer, CONSTRAINT "PK_3e474643b0a303b276016022eba" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_956335d29b8c399a3d90b941a5" ON "QuestionManagementTbl" ("CreatedDate") `);
        await queryRunner.query(`ALTER TABLE "QuestionManagementTbl" ADD CONSTRAINT "FK_f4dc6522134110de2ff8f11dcf0" FOREIGN KEY ("image_id") REFERENCES "upload"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuestionManagementTbl" DROP CONSTRAINT "FK_f4dc6522134110de2ff8f11dcf0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_956335d29b8c399a3d90b941a5"`);
        await queryRunner.query(`DROP TABLE "QuestionManagementTbl"`);
        await queryRunner.query(`DROP TYPE "public"."QuestionManagementTbl_questiontype_enum"`);
        await queryRunner.query(`DROP TABLE "upload"`);
        await queryRunner.query(`DROP TYPE "public"."upload_type_enum"`);
    }

}
