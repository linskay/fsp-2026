package ru.fsp.careerarena.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Результат загрузки файла (аватар соискателя, логотип компании, резюме)")
public class FileUploadDto {

    @Schema(description = "Публичный URL загруженного файла", example = "https://images.unsplash.com/photo-1534528741775-53994a69daeb")
    private String url;

    @Schema(description = "Оригинальное имя файла", example = "avatar.png")
    private String filename;

    @Schema(description = "Размер файла в байтах", example = "204850")
    private long sizeBytes;

    @Schema(description = "MIME-тип файла", example = "image/png")
    private String contentType;
}
