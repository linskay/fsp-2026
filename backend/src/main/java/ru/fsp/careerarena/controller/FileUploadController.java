package ru.fsp.careerarena.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.fsp.careerarena.dto.FileUploadDto;

import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
@Tag(name = "File Upload (S3/Media Storage)", description = "Загрузка и прикрепление файлов: аватарок соискателей, логотипов компаний и PDF-резюме")
public class FileUploadController {

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Загрузка файла (MultipartFile) для профиля пользователя или компании")
    public ResponseEntity<FileUploadDto> uploadFile(
            @Parameter(description = "Загружаемый файл", required = true)
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "Категория хранилища (avatars, logos, resumes)")
            @RequestParam(value = "category", required = false, defaultValue = "avatars") String category
    ) throws IOException {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file_" + UUID.randomUUID();
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
        long size = file.getSize();

        // Convert small images to reliable data URI or public mock cloud URL
        String generatedUrl;
        if (contentType.startsWith("image/") && size < 500000) {
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            generatedUrl = "data:" + contentType + ";base64," + base64;
        } else {
            String fileId = UUID.randomUUID().toString();
            generatedUrl = "https://fsp-career.ru/media/" + category + "/" + fileId + "_" + originalFilename;
        }

        return ResponseEntity.ok(FileUploadDto.builder()
                .url(generatedUrl)
                .filename(originalFilename)
                .contentType(contentType)
                .sizeBytes(size)
                .build());
    }
}
