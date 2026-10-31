-- ==============================================================================
-- macOS Web Operating System - Enterprise Multi-User & Database Schema (MySQL 8.4 LTS)
-- ==============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS `macos_desktop_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `macos_desktop_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `email` VARCHAR(191) NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(128) NOT NULL,
  `avatar_url` VARCHAR(500) DEFAULT '',
  `role` ENUM('admin', 'user', 'guest') DEFAULT 'user',
  `storage_quota_bytes` BIGINT UNSIGNED DEFAULT 5368709120, -- 5 GB quota
  `storage_used_bytes` BIGINT UNSIGNED DEFAULT 0,
  `is_suspended` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_username` (`username`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sessions Table (Stateful Server-Side Sessions)
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(128) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT '',
  `user_agent` TEXT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_session_token` (`token_hash`),
  INDEX `idx_session_user` (`user_id`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Desktop Preferences
CREATE TABLE IF NOT EXISTS `user_desktops` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL UNIQUE,
  `wallpaper_url` VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=80',
  `dark_mode` BOOLEAN DEFAULT TRUE,
  `dock_position` ENUM('bottom', 'left', 'right') DEFAULT 'bottom',
  `dock_size` INT DEFAULT 56,
  `dock_magnification` BOOLEAN DEFAULT TRUE,
  `accent_color` VARCHAR(32) DEFAULT '#007aff',
  `active_spaces_count` INT DEFAULT 1,
  `screen_brightness` INT DEFAULT 95,
  `sound_volume` INT DEFAULT 85,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_desktops_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Desktop Widgets System (Persistent Widgets Grid)
CREATE TABLE IF NOT EXISTS `desktop_widgets` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `widget_type` VARCHAR(64) NOT NULL,
  `widget_size` ENUM('small', 'medium', 'large') DEFAULT 'medium',
  `position_x` INT DEFAULT 0,
  `position_y` INT DEFAULT 0,
  `widget_state` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_widgets_user` (`user_id`),
  CONSTRAINT `fk_widgets_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Personal Virtual File System (Per-User /home/{userId})
CREATE TABLE IF NOT EXISTS `user_files` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `parent_id` VARCHAR(64) NULL,
  `name` VARCHAR(255) NOT NULL,
  `path` VARCHAR(1000) NOT NULL,
  `is_directory` BOOLEAN DEFAULT FALSE,
  `size_bytes` BIGINT UNSIGNED DEFAULT 0,
  `mime_type` VARCHAR(128) DEFAULT 'text/plain',
  `content_text` LONGTEXT NULL,
  `is_trash` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_files_user` (`user_id`),
  INDEX `idx_files_parent` (`parent_id`),
  INDEX `idx_files_path` (`user_id`, `path`(255)),
  CONSTRAINT `fk_files_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. User Isolated MySQL Databases
CREATE TABLE IF NOT EXISTS `user_databases` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `db_name` VARCHAR(64) NOT NULL UNIQUE,
  `display_name` VARCHAR(128) NOT NULL,
  `db_username` VARCHAR(64) NOT NULL,
  `db_password_hash` VARCHAR(255) NOT NULL,
  `quota_bytes` BIGINT UNSIGNED DEFAULT 1073741824, -- 1 GB quota
  `size_bytes` BIGINT UNSIGNED DEFAULT 0,
  `tables_count` INT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_databases_user` (`user_id`),
  CONSTRAINT `fk_databases_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Database Backups
CREATE TABLE IF NOT EXISTS `database_backups` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `db_name` VARCHAR(64) NOT NULL,
  `backup_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `size_bytes` BIGINT UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_backups_user` (`user_id`),
  CONSTRAINT `fk_backups_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. SQL Query Execution History
CREATE TABLE IF NOT EXISTS `sql_query_history` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `db_name` VARCHAR(64) NOT NULL,
  `query_text` TEXT NOT NULL,
  `status` ENUM('success', 'error') DEFAULT 'success',
  `duration_ms` INT UNSIGNED DEFAULT 0,
  `rows_affected` INT UNSIGNED DEFAULT 0,
  `error_message` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_history_user` (`user_id`),
  CONSTRAINT `fk_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Security & Audit Logging
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NULL,
  `action` VARCHAR(128) NOT NULL,
  `resource` VARCHAR(128) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT '',
  `details` JSON NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;
