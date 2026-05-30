"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Plus, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToolEvents } from "@/lib/analytics";

interface ColorEntry {
  id: string;
  name: string;
  value: string;
}

interface FontFamily {
  key: "sans" | "serif" | "mono";
  values: string;
}

interface Breakpoint {
  id: string;
  name: string;
  value: string;
}

interface TailwindConfig {
  colors: ColorEntry[];
  fontFamilies: FontFamily[];
  breakpoints: Breakpoint[];
  plugins: string[];
  contentPaths: string[];
  outputFormat: "js" | "ts";
  version: "v3" | "v4";
}

const DEFAULT_COLORS: ColorEntry[] = [
  { id: "1", name: "primary", value: "#3b82f6" },
  { id: "2", name: "secondary", value: "#6366f1" },
];

const DEFAULT_FONT_FAMILIES: FontFamily[] = [
  { key: "sans", values: "Inter, ui-sans-serif, system-ui" },
  { key: "serif", values: "ui-serif, Georgia, Cambria" },
  { key: "mono", values: "ui-monospace, SFMono-Regular, Menlo" },
];

const DEFAULT_BREAKPOINTS: Breakpoint[] = [
  { id: "1", name: "sm", value: "640px" },
  { id: "2", name: "md", value: "768px" },
  { id: "3", name: "lg", value: "1024px" },
  { id: "4", name: "xl", value: "1280px" },
  { id: "5", name: "2xl", value: "1536px" },
];

const AVAILABLE_PLUGINS = [
  {
    id: "@tailwindcss/forms",
    label: "@tailwindcss/forms",
    description: "Better form element styles",
  },
  {
    id: "@tailwindcss/typography",
    label: "@tailwindcss/typography",
    description: "Prose typography styles",
  },
  {
    id: "@tailwindcss/aspect-ratio",
    label: "@tailwindcss/aspect-ratio",
    description: "Aspect ratio utilities",
  },
  {
    id: "@tailwindcss/line-clamp",
    label: "@tailwindcss/line-clamp",
    description: "Line clamp utilities",
  },
];

const DEFAULT_CONTENT_PATHS = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];

const DEFAULT_CONFIG: TailwindConfig = {
  colors: DEFAULT_COLORS,
  fontFamilies: DEFAULT_FONT_FAMILIES,
  breakpoints: DEFAULT_BREAKPOINTS,
  plugins: [],
  contentPaths: DEFAULT_CONTENT_PATHS,
  outputFormat: "js",
  version: "v3",
};

function generateV3Config(config: TailwindConfig): string {
  const colorsSection =
    config.colors.length > 0
      ? `      colors: {\n${config.colors.map((c) => `        ${c.name}: "${c.value}",`).join("\n")}\n      },`
      : "";

  const fontsSection = config.fontFamilies
    .filter((f) => f.values.trim())
    .map(
      (f) =>
        `        ${f.key}: [${f.values
          .split(",")
          .map((v) => `"${v.trim()}"`)
          .join(", ")}],`
    )
    .join("\n");

  const breakpointsSection =
    config.breakpoints.length > 0
      ? `      screens: {\n${config.breakpoints.map((b) => `        "${b.name}": "${b.value}",`).join("\n")}\n      },`
      : "";

  const pluginsSection =
    config.plugins.length > 0
      ? `\n  plugins: [\n${config.plugins.map((p) => `    require("${p}"),`).join("\n")}\n  ],`
      : "";

  const contentSection = config.contentPaths
    .map((p) => `    "${p}",`)
    .join("\n");

  const extendParts = [
    colorsSection,
    fontsSection
      ? `      fontFamily: {\n${fontsSection}\n      },`
      : "",
    breakpointsSection,
  ]
    .filter(Boolean)
    .join("\n");

  if (config.outputFormat === "ts") {
    return `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
${contentSection}
  ],
  theme: {
    extend: {
${extendParts}
    },
  },${pluginsSection}
};

export default config;`;
  }

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
${contentSection}
  ],
  theme: {
    extend: {
${extendParts}
    },
  },${pluginsSection}
};`;
}

function generateV4Config(config: TailwindConfig): string {
  const colorVars = config.colors
    .map((c) => `  --color-${c.name}: ${c.value};`)
    .join("\n");

  const fontVars = config.fontFamilies
    .filter((f) => f.values.trim())
    .map((f) => `  --font-${f.key}: ${f.values};`)
    .join("\n");

  const breakpointVars = config.breakpoints
    .map((b) => `  --breakpoint-${b.name}: ${b.value};`)
    .join("\n");

  const pluginsImports = config.plugins
    .map((p) => `@plugin "${p}";`)
    .join("\n");

  const themeParts = [colorVars, fontVars, breakpointVars]
    .filter(Boolean)
    .join("\n");

  return `@import "tailwindcss";
${pluginsImports ? `\n${pluginsImports}\n` : ""}
@theme {
${themeParts}
}`;
}

export function TailwindConfigGeneratorTool() {
  const [config, setConfig] = useState<TailwindConfig>(DEFAULT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");

  const generatedConfig =
    config.version === "v4"
      ? generateV4Config(config)
      : generateV3Config(config);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedConfig);
      setCopied(true);
      toast.success("Config copied to clipboard!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please select and copy manually.");
    }
  }, [generatedConfig]);

  const addColor = () => {
    setConfig((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        { id: Date.now().toString(), name: "custom", value: "#6366f1" },
      ],
    }));
  };

  const removeColor = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.id !== id),
    }));
  };

  const updateColor = (id: string, field: "name" | "value", value: string) => {
    setConfig((prev) => ({
      ...prev,
      colors: prev.colors.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }));
  };

  const updateFont = (key: FontFamily["key"], values: string) => {
    setConfig((prev) => ({
      ...prev,
      fontFamilies: prev.fontFamilies.map((f) =>
        f.key === key ? { ...f, values } : f
      ),
    }));
  };

  const addBreakpoint = () => {
    setConfig((prev) => ({
      ...prev,
      breakpoints: [
        ...prev.breakpoints,
        { id: Date.now().toString(), name: "custom", value: "1400px" },
      ],
    }));
  };

  const removeBreakpoint = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      breakpoints: prev.breakpoints.filter((b) => b.id !== id),
    }));
  };

  const updateBreakpoint = (
    id: string,
    field: "name" | "value",
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      breakpoints: prev.breakpoints.map((b) =>
        b.id === id ? { ...b, [field]: value } : b
      ),
    }));
  };

  const togglePlugin = (pluginId: string) => {
    setConfig((prev) => ({
      ...prev,
      plugins: prev.plugins.includes(pluginId)
        ? prev.plugins.filter((p) => p !== pluginId)
        : [...prev.plugins, pluginId],
    }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    toast.success("Config reset to defaults");
  };

  const configFileName =
    config.version === "v4"
      ? "tailwind.css"
      : `tailwind.config.${config.outputFormat}`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel — Config Inputs */}
        <div className="space-y-4">
          {/* Version + Format Toggle */}
          <Card className="border-border/50 bg-card/50 py-4">
            <CardContent className="px-4">
              <div className="flex flex-wrap gap-6 items-start">
                <div>
                  <p className="text-sm font-medium mb-2">Tailwind Version</p>
                  <div className="flex gap-2">
                    {(["v3", "v4"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() =>
                          setConfig((prev) => ({ ...prev, version: v }))
                        }
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          config.version === v
                            ? "bg-brand text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                {config.version === "v3" && (
                  <div>
                    <p className="text-sm font-medium mb-2">Output Format</p>
                    <div className="flex gap-2">
                      {(["js", "ts"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() =>
                            setConfig((prev) => ({ ...prev, outputFormat: f }))
                          }
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            config.outputFormat === f
                              ? "bg-brand text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          .{f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="fonts">Fonts</TabsTrigger>
              <TabsTrigger value="breakpoints">Breakpoints</TabsTrigger>
              <TabsTrigger value="plugins">Plugins</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-3 mt-4">
              {config.colors.map((color) => (
                <motion.div
                  key={color.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="color"
                    value={color.value}
                    onChange={(e) =>
                      updateColor(color.id, "value", e.target.value)
                    }
                    className="h-10 w-10 rounded-lg cursor-pointer border border-border bg-transparent p-0.5 flex-shrink-0"
                    title="Pick color"
                  />
                  <Input
                    value={color.name}
                    onChange={(e) =>
                      updateColor(color.id, "name", e.target.value)
                    }
                    placeholder="Color name (e.g. primary)"
                    className="flex-1 min-w-0"
                  />
                  <Input
                    value={color.value}
                    onChange={(e) =>
                      updateColor(color.id, "value", e.target.value)
                    }
                    placeholder="#000000"
                    className="w-28 font-mono text-sm flex-shrink-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColor(color.id)}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              <Button
                variant="outline"
                onClick={addColor}
                className="w-full gap-2 mt-2"
              >
                <Plus className="h-4 w-4" /> Add Color
              </Button>
            </TabsContent>

            {/* Fonts Tab */}
            <TabsContent value="fonts" className="space-y-4 mt-4">
              {config.fontFamilies.map((font) => (
                <div key={font.key}>
                  <label className="text-sm font-medium mb-1.5 block capitalize">
                    {font.key}
                  </label>
                  <Input
                    value={font.values}
                    onChange={(e) => updateFont(font.key, e.target.value)}
                    placeholder="Font stack (comma-separated)"
                    className="font-mono text-sm"
                  />
                </div>
              ))}
            </TabsContent>

            {/* Breakpoints Tab */}
            <TabsContent value="breakpoints" className="space-y-3 mt-4">
              {config.breakpoints.map((bp) => (
                <motion.div
                  key={bp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3"
                >
                  <Input
                    value={bp.name}
                    onChange={(e) =>
                      updateBreakpoint(bp.id, "name", e.target.value)
                    }
                    placeholder="sm"
                    className="w-24 flex-shrink-0"
                  />
                  <Input
                    value={bp.value}
                    onChange={(e) =>
                      updateBreakpoint(bp.id, "value", e.target.value)
                    }
                    placeholder="640px"
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBreakpoint(bp.id)}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              <Button
                variant="outline"
                onClick={addBreakpoint}
                className="w-full gap-2 mt-2"
              >
                <Plus className="h-4 w-4" /> Add Breakpoint
              </Button>
            </TabsContent>

            {/* Plugins Tab */}
            <TabsContent value="plugins" className="space-y-3 mt-4">
              {AVAILABLE_PLUGINS.map((plugin) => (
                <div
                  key={plugin.id}
                  onClick={() => togglePlugin(plugin.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    config.plugins.includes(plugin.id)
                      ? "border-brand bg-brand/5"
                      : "border-border/50 bg-muted/30 hover:border-brand/30"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      config.plugins.includes(plugin.id)
                        ? "bg-brand border-brand"
                        : "border-muted-foreground"
                    }`}
                  >
                    {config.plugins.includes(plugin.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-mono font-medium">
                      {plugin.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {plugin.description}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel — Generated Config Preview */}
        <div>
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-mono text-muted-foreground">
                  {configFileName}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="gap-1.5 text-muted-foreground h-8"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 bg-gradient-to-r from-brand to-brand-accent text-white h-8"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy Config"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-4 pb-4">
              <pre className="rounded-xl bg-muted/50 border border-border/40 p-4 overflow-x-auto text-xs font-mono leading-relaxed text-foreground/80 max-h-[540px] overflow-y-auto whitespace-pre-wrap break-all">
                {generatedConfig}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
