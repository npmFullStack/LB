// src/components/Select.jsx
import React from "react";
import Select from "react-select";

const CustomSelect = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    isClearable = true,
    isSearchable = false,
    className = "",
    error,
    ...props
}) => {
    // Custom styles that match your design system
    const customStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: "white",
            borderColor: state.isFocused ? "#EB6914" : "#d1d5db",
            borderWidth: "1px",
            borderRadius: "0.5rem",
            boxShadow: state.isFocused
                ? "0 0 0 2px rgba(235, 105, 20, 0.2)"
                : "none",
            "&:hover": {
                borderColor: "#EB6914"
            },
            padding: "0.125rem 0",
            minHeight: "42px",
            fontSize: "1rem",
            cursor: "pointer"
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? "#FFF7ED" : "white",
            color: state.isSelected ? "#EB6914" : "#374151",
            cursor: "pointer",
            fontSize: "0.875rem",
            padding: "8px 12px",
            "&:active": {
                backgroundColor: "#FFEDD5"
            }
        }),
        menu: base => ({
            ...base,
            borderRadius: "0.5rem",
            overflow: "hidden",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            marginTop: "0.25rem"
        }),
        menuList: base => ({
            ...base,
            padding: "0"
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#EB6914" : "#9ca3af",
            "&:hover": {
                color: "#EB6914"
            }
        }),
        clearIndicator: (base, state) => ({
            ...base,
            color: state.isFocused ? "#EB6914" : "#9ca3af",
            "&:hover": {
                color: "#EF4444"
            }
        }),
        placeholder: base => ({
            ...base,
            color: "#9ca3af",
                    }),
        singleValue: base => ({
            ...base,
            color: "#374151",
                    }),
        input: base => ({
            ...base,
                    }),
        noOptionsMessage: base => ({
            ...base,
                        color: "#6b7280"
        })
    };

    // Format options to work with react-select
    const formattedOptions = options.map(opt => {
        if (typeof opt === "string") {
            return { value: opt, label: opt };
        }
        return opt;
    });

    // Find the selected option object
    const selectedOption = formattedOptions.find(opt => opt.value === value);

    return (
        <div className={className}>
            <Select
                options={formattedOptions}
                value={selectedOption || null}
                onChange={option => onChange(option ? option.value : "")}
                placeholder={placeholder}
                isClearable={isClearable}
                isSearchable={isSearchable}
                styles={customStyles}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500 font-sans">{error}</p>
            )}
        </div>
    );
};

export default CustomSelect;
