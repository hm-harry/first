/**
 * API 类型定义 (基于 OpenAPI 3.1 / Springdoc-openapi 生成)
 *
 * 本文件应与后端 OpenAPI spec 保持同步。
 * 后端 Swagger UI: http://localhost:8080/swagger-ui.html
 * OpenAPI JSON:    http://localhost:8080/v3/api-docs
 *
 * 当后端 API 变更时，使用 openapi-typescript 等工具重新生成此文件：
 *   npx openapi-typescript http://localhost:8080/v3/api-docs -o src/types/api.ts
 */

/* ============ 通用类型 ============ */

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

/* ============ 示例实体 (根据后端 API 扩展) ============ */

// 示例：当后端定义了实体后，在此处添加对应 TypeScript 类型
// export interface User {
//   id: number;
//   email: string;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
// }
