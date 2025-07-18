import { useState, useCallback } from "react";
import { APIManager } from "../lib/api-manager";
import { GenerationManager } from "../lib/auth-manager";
import type {
  GenerateImageRequest,
  GenerateImageResponse,
  SaveImageRequest,
  SaveImageResponse,
  UserStatsResponse,
  GalleryResponse,
  StylesResponse,
} from "@shared/api";

export function useGenerateImage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  const generateImage = useCallback(
    async (params: GenerateImageRequest): Promise<GenerateImageResponse> => {
      const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      setIsGenerating(true);
      setError(null);
      setProgress("Starting generation...");

      try {
        // Save generation progress
        GenerationManager.saveProgress(generationId, {
          prompt: params.prompt,
          style: params.styleId,
          status: 'starting'
        });

        setProgress("Sending request to AI...");
        
        const result = await APIManager.generateImage(params);

        if (!result.success) {
          throw new Error(result.error || "Generation failed");
        }

        setProgress("Generation completed!");
        
        // Clear generation progress on success
        GenerationManager.clearProgress(generationId);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Generation failed";
        setError(errorMessage);
        
        // Save error state
        GenerationManager.saveProgress(generationId, {
          prompt: params.prompt,
          style: params.styleId,
          status: 'error',
          error: errorMessage
        });
        
        throw new Error(errorMessage);
      } finally {
        setIsGenerating(false);
        setProgress("");
      }
    },
    [],
  );

  // Restore any ongoing generations on mount
  const restoreGenerations = useCallback(() => {
    const restoredGenerations = GenerationManager.restoreProgress();
    if (restoredGenerations.length > 0) {
      console.log('Restored ongoing generations:', restoredGenerations);
      // You can set state here if needed for UI
    }
  }, []);

  return {
    generateImage,
    isGenerating,
    error,
    progress,
    restoreGenerations,
  };
}

export function useSaveImage() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveImage = useCallback(
    async (params: SaveImageRequest): Promise<SaveImageResponse> => {
      setIsSaving(true);
      setError(null);

      try {
        const result = await APIManager.saveImage(params);

        if (!result.success) {
          throw new Error(result.error || "Save failed");
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Save failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  return {
    saveImage,
    isSaving,
    error,
  };
}

export function useUserStats() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserStats = useCallback(async (): Promise<UserStatsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = "/api/user";
      console.log("Fetching user stats from:", apiUrl);
      console.log("Current location:", window.location.href);
      console.log("Current origin:", window.location.origin);

      const response = await fetch(apiUrl);

      console.log("User stats response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("User stats error response:", errorText);
        throw new Error(
          `Failed to get user stats: ${response.status} ${response.statusText}`,
        );
      }

      const result: UserStatsResponse = await response.json();
      console.log("User stats result:", result);

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get user stats";
      console.error("User stats fetch error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getUserStats,
    isLoading,
    error,
  };
}

export function useGallery() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGallery = useCallback(
    async (limit = 50, offset = 0): Promise<GalleryResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/gallery?limit=${limit}&offset=${offset}`,
        );

        if (!response.ok) {
          throw new Error("Failed to get gallery");
        }

        const result: GalleryResponse = await response.json();

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get gallery";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return {
    getGallery,
    isLoading,
    error,
  };
}

export function useStyles() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStyles = useCallback(async (): Promise<StylesResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = "/api/styles";
      console.log("Fetching styles from:", apiUrl);
      console.log("Current location:", window.location.href);
      console.log("Current origin:", window.location.origin);

      const response = await fetch(apiUrl);

      console.log("Styles response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Styles error response:", errorText);
        throw new Error(
          `Failed to get styles: ${response.status} ${response.statusText}`,
        );
      }

      const result: StylesResponse = await response.json();
      console.log("Styles result:", result);

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get styles";
      console.error("Styles fetch error:", err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    getStyles,
    isLoading,
    error,
  };
}
