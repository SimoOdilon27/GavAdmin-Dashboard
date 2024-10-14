// utils/formatValue.js

// Helper function to check if the string is in ISO 8601 format
const isISODateString = (str) => {
    return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d+/.test(str);
};

// Helper function to convert a string to Pascal Case
const toPascalCase = (str) => {
    return str
        .split(' ') // Split string by spaces
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lowercase the rest
        .join(' '); // Join the words back
};

// Main formatValue function to handle different types of data
export const formatValue = (value) => {
    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }
    if (value === null || value === undefined) {
        return 'N/A';
    }
    if (typeof value === 'number') {
        return value.toLocaleString(); // Format numbers with commas
    }
    if (typeof value === 'string') {
        // Check if it's an ISO 8601 date string and convert it to Date object
        if (isISODateString(value)) {
            const dateObj = new Date(value);
            return `${dateObj.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })} ${dateObj.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })}`;
        }
        // For non-date strings, format to Pascal Case and replace underscores with spaces
        return toPascalCase(value.replace(/_/g, ' '));
    }
    if (value instanceof Date) {
        return `${value.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })} ${value.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })}`;
    }
    return value.toString();
};
