import { useEffect, useState } from "react";

import { uploadProductImage as uploadProductImageRequest } from "../services/uploadsApi";

export function useProductImageUpload({ adminHeaders, adminUnlocked, appendProductImage }) {
  const [imageUpload, setImageUpload] = useState({ file: null, preview: "", status: "idle", message: "" });

  useEffect(() => () => {
    if (imageUpload.preview) {
      URL.revokeObjectURL(imageUpload.preview);
    }
  }, [imageUpload.preview]);

  function updateProductImageFile(file) {
    if (imageUpload.preview) {
      URL.revokeObjectURL(imageUpload.preview);
    }

    setImageUpload({
      file,
      preview: file ? URL.createObjectURL(file) : "",
      status: "idle",
      message: file ? "Imagen lista para subir." : "",
    });
  }

  function resetProductImageUpload() {
    updateProductImageFile(null);
  }

  async function uploadProductImage() {
    if (!adminUnlocked) {
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "error", message: "Desbloquea el panel admin antes de subir imagenes." }));
      return;
    }

    if (!imageUpload.file) {
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "error", message: "Elegi una imagen primero." }));
      return;
    }

    const formData = new FormData();
    formData.append("image", imageUpload.file);
    setImageUpload((currentUpload) => ({ ...currentUpload, status: "loading", message: "Subiendo imagen a Cloudinary..." }));

    try {
      const { response, data } = await uploadProductImageRequest(formData, { headers: adminHeaders() });

      if (!response.ok) {
        throw new Error(data.message || "No pudimos subir la imagen.");
      }

      appendProductImage(data.image.url);
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "success", message: "Imagen subida y URL cargada." }));
    } catch (error) {
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "error", message: `${error.message} Revisa Cloudinary en Render.` }));
    }
  }

  return {
    imageUpload,
    resetProductImageUpload,
    updateProductImageFile,
    uploadProductImage,
  };
}
