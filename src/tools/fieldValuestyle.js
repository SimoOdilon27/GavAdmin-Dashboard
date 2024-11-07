import { useTheme } from "@mui/material";
import { tokens } from "../theme";

export const FormFieldStyles = (gridColumn = "span 2") => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return {
        gridColumn,
        '& .MuiInputLabel-root': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[700],
        },
        '& .MuiFilledInput-root': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[700],
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.black[100],
        },
    };
};
