import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/design-system";
import { useNavigation } from "../components/navigation/hooks/useNavigation";
import { useTranslation } from "../hooks/use-translation";
import { useStyles } from "../hooks/use-api";
import type { Style } from "@shared/api";

interface EditingStyle extends Partial<Style> {
  isNew?: boolean;
}

export default function AdminStyles() {
  const { t } = useTranslation();
  const { navigateToPath } = useNavigation();
  const { getStyles } = useStyles();

  const [styles, setStyles] = useState<Style[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingStyle, setEditingStyle] = useState<EditingStyle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  // Load styles on component mount
  useEffect(() => {
    const loadStyles = async () => {
      try {
        setIsLoading(true);
        const result = await getStyles();
        setStyles(result.styles);
      } catch (error) {
        console.error("Failed to load styles:", error);
        setStyles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStyles();
  }, [getStyles]);

  // Filter styles based on search query
  const filteredStyles = styles.filter((style) =>
    style.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEditStyle = (style: Style) => {
    setEditingStyle(style);
    setIsEditing(true);
    setPreviewImageUrl(style.thumbnail || "");
  };

  const handleNewStyle = () => {
    setEditingStyle({
      isNew: true,
      name: "",
      description: "",
      thumbnail: "",
      promptJson: {
        style: "",
        materials: {},
        background: {},
      },
    });
    setIsEditing(true);
    setPreviewImageUrl("");
  };

  const handleSaveStyle = async () => {
    if (!editingStyle || !editingStyle.name) {
      alert("Please provide a style name");
      return;
    }

    try {
      setIsLoading(true);

      // This would be an API call in production
      // const result = editingStyle.isNew
      //   ? await createStyle(editingStyle)
      //   : await updateStyle(editingStyle.id, editingStyle);

      // Mock implementation
      if (editingStyle.isNew) {
        const newStyle: Style = {
          id: `style-${Date.now()}`,
          name: editingStyle.name,
          description: editingStyle.description || "",
          thumbnail: editingStyle.thumbnail || "",
          promptJson: editingStyle.promptJson || {},
        };
        setStyles((prev) => [...prev, newStyle]);
      } else {
        setStyles((prev) =>
          prev.map((style) =>
            style.id === editingStyle.id
              ? { ...style, ...editingStyle }
              : style,
          ),
        );
      }

      setIsEditing(false);
      setEditingStyle(null);
      setPreviewImageUrl("");
      alert("Style saved successfully!");
    } catch (error) {
      console.error("Failed to save style:", error);
      alert("Failed to save style. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStyle = async (styleId: string) => {
    if (!confirm("Are you sure you want to delete this style?")) {
      return;
    }

    try {
      setIsLoading(true);

      // This would be an API call in production
      // await deleteStyle(styleId);

      // Mock implementation
      setStyles((prev) => prev.filter((style) => style.id !== styleId));
      alert("Style deleted successfully!");
    } catch (error) {
      console.error("Failed to delete style:", error);
      alert("Failed to delete style. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingStyle(null);
    setPreviewImageUrl("");
  };

  const updateEditingStyle = (field: string, value: any) => {
    setEditingStyle((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const updatePromptJson = (field: string, value: any) => {
    setEditingStyle((prev) =>
      prev
        ? {
            ...prev,
            promptJson: {
              ...prev.promptJson,
              [field]: value,
            },
          }
        : null,
    );
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* Header */}
      <div className="flex items-center justify-between w-full px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigateToPath({ path: "/" })}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Style Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage AI generation styles and prompts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleNewStyle}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Style
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-2 bg-muted rounded-lg border border-border min-w-[300px]">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground border-none outline-none flex-1"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredStyles.length} style
              {filteredStyles.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Styles Grid */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading styles...</p>
            </div>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStyles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Style Image */}
                <div className="relative h-48 bg-muted">
                  {style.thumbnail ? (
                    <img
                      src={style.thumbnail}
                      alt={style.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      onClick={() => handleEditStyle(style)}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteStyle(style.id)}
                      className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Style Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    {style.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {style.description || "No description provided"}
                  </p>

                  {/* Prompt JSON Preview */}
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-3 h-3" />
                      Prompt Configuration:
                    </div>
                    <div className="bg-muted/50 p-2 rounded text-xs font-mono max-h-20 overflow-y-auto">
                      {JSON.stringify(style.promptJson, null, 2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredStyles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No styles found matching your search."
                : "No styles found. Create your first style!"}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && editingStyle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingStyle.isNew ? "Create New Style" : "Edit Style"}
                </h2>
                <Button
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Style Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Style Name
                  </label>
                  <input
                    type="text"
                    value={editingStyle.name || ""}
                    onChange={(e) => updateEditingStyle("name", e.target.value)}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter style name..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingStyle.description || ""}
                    onChange={(e) =>
                      updateEditingStyle("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Enter style description..."
                  />
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={editingStyle.thumbnail || ""}
                    onChange={(e) => {
                      updateEditingStyle("thumbnail", e.target.value);
                      setPreviewImageUrl(e.target.value);
                    }}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  {previewImageUrl && (
                    <div className="mt-2">
                      <img
                        src={previewImageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-border"
                        onError={() => setPreviewImageUrl("")}
                      />
                    </div>
                  )}
                </div>

                {/* Prompt JSON */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prompt JSON Configuration
                  </label>
                  <textarea
                    value={JSON.stringify(
                      editingStyle.promptJson || {},
                      null,
                      2,
                    )}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        updateEditingStyle("promptJson", parsed);
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={10}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Enter JSON configuration..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This JSON object defines how the AI should generate images
                    in this style.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border">
                <Button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveStyle}
                  disabled={isLoading || !editingStyle.name}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Style"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
