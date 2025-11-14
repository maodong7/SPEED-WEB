import { IsString, IsNotEmpty } from 'class-validator';

export class AddCollectionDto {
  @IsString()
  @IsNotEmpty()
  submissionId: string; // 要收藏的文献ID
}

export class RemoveCollectionDto {
  @IsString()
  @IsNotEmpty()
  submissionId: string; // 要取消收藏的文献ID
}