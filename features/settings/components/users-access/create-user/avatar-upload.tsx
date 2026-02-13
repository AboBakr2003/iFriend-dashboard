"use client"

import * as React from "react"
import CameraIcon from "@/public/camera-icon"

interface AvatarUploadProps {
  avatarPreview?: string
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function AvatarUpload({ avatarPreview, onFileSelect }: AvatarUploadProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <input
        id="user-avatar"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileSelect}
      />
      <label
        htmlFor="user-avatar"
        className="w-20 h-20 rounded-full bg-natural flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden relative group"
      >
        {avatarPreview ? (
          <>
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <CameraIcon className="w-8 h-8 text-white" />
            </div>
          </>
        ) : (
          <CameraIcon className="w-8 h-8 text-natural-text" />
        )}
      </label>
      <span className="text-sm text-natural-text">{!avatarPreview && "Add a personal photo"}</span>
    </div>
  )
}
