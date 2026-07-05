"use client";

import { TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";
import { Box } from "@mui/material";

export const ImagePreviewInput = (props: {
  source: string;
  label?: string;
  validate?: any;
  helperText?: string;
}) => {
  const { source, ...rest } = props;
  const { watch } = useFormContext();
  const src = watch(source);

  return (
    <Box>
      <TextInput source={source} {...rest} />
      {src && (
        <Box
          sx={{
            mt: 1,
            width: 160,
            height: 100,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.100",
          }}
        >
          <Box
            component="img"
            src={src}
            alt="preview"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </Box>
      )}
    </Box>
  );
};
