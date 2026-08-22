// components/ui/Select.jsx — accessible custom select
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import Input from "./Input";

/**
 * Fixes three defects in the previous implementation:
 *
 *  1. The dropdown only closed when you picked an option or clicked the trigger
 *     again. Clicking anywhere else left it open, floating over whatever came
 *     next in the form — on the registration screens that meant an open "Type
 *     of food" list covered "Operating hours" and swallowed clicks on it.
 *  2. The hidden native <select> mirrored `multiple` while always receiving a
 *     string value, which React rejects (it requires an array when multiple).
 *  3. Options were plain <div onClick>: no listbox/option roles, no keyboard
 *     support, unreachable for anyone not using a mouse.
 */
const Select = React.forwardRef(({
    className,
    options = [],
    value,
    defaultValue,
    placeholder = "Select an option",
    multiple = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    searchable = false,
    clearable = false,
    loading = false,
    id,
    name,
    onChange,
    onOpenChange,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    const generatedId = useId();
    const selectId = id || `select-${generatedId}`;
    const listboxId = `${selectId}-listbox`;
    const rootRef = useRef(null);
    const triggerRef = useRef(null);

    // `multiple` means the value is a list; normalise once so every branch below
    // can rely on the shape rather than re-checking it.
    const selectedValues = useMemo(() => {
        if (!multiple) return value === undefined || value === "" ? [] : [value];
        return Array.isArray(value) ? value : [];
    }, [multiple, value]);

    const filteredOptions = useMemo(() => {
        if (!searchable || !searchTerm) return options;
        const needle = searchTerm.toLowerCase();
        return options.filter(
            (option) =>
                option.label.toLowerCase().includes(needle) ||
                String(option.value ?? "").toLowerCase().includes(needle)
        );
    }, [options, searchTerm, searchable]);

    const close = useCallback(() => {
        setIsOpen(false);
        setSearchTerm("");
        setActiveIndex(-1);
        onOpenChange?.(false);
    }, [onOpenChange]);

    // Dismiss on outside click and on Escape — the behaviour every other
    // dropdown on the page has, and the one this component was missing.
    useEffect(() => {
        if (!isOpen) return undefined;

        const handlePointerDown = (event) => {
            if (rootRef.current && !rootRef.current.contains(event.target)) close();
        };
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                close();
                triggerRef.current?.focus();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [close, isOpen]);

    const displayText = useMemo(() => {
        if (!selectedValues.length) return placeholder;
        if (multiple) {
            if (selectedValues.length === 1) {
                return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder;
            }
            return `${selectedValues.length} selected`;
        }
        return options.find((o) => o.value === selectedValues[0])?.label ?? placeholder;
    }, [multiple, options, placeholder, selectedValues]);

    const isSelected = (optionValue) => selectedValues.includes(optionValue);

    const handleToggle = () => {
        if (disabled) return;
        if (isOpen) {
            close();
        } else {
            setIsOpen(true);
            setActiveIndex(filteredOptions.findIndex((o) => isSelected(o.value)));
            onOpenChange?.(true);
        }
    };

    const handleOptionSelect = (option) => {
        if (option.disabled) return;
        if (multiple) {
            onChange?.(
                isSelected(option.value)
                    ? selectedValues.filter((v) => v !== option.value)
                    : [...selectedValues, option.value]
            );
        } else {
            onChange?.(option.value);
            close();
            triggerRef.current?.focus();
        }
    };

    const handleTriggerKeyDown = (event) => {
        if (disabled) return;

        if (!isOpen) {
            if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
                event.preventDefault();
                handleToggle();
            }
            return;
        }

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const step = event.key === "ArrowDown" ? 1 : -1;
            const count = filteredOptions.length;
            if (!count) return;
            setActiveIndex((prev) => {
                let next = prev;
                // Skip disabled options rather than parking the highlight on one.
                for (let i = 0; i < count; i += 1) {
                    next = (next + step + count) % count;
                    if (!filteredOptions[next]?.disabled) return next;
                }
                return prev;
            });
        } else if (event.key === "Enter" || event.key === " ") {
            if (activeIndex >= 0 && filteredOptions[activeIndex]) {
                event.preventDefault();
                handleOptionSelect(filteredOptions[activeIndex]);
            }
        } else if (event.key === "Tab") {
            close();
        }
    };

    const handleClear = (event) => {
        event.stopPropagation();
        onChange?.(multiple ? [] : "");
    };

    const hasValue = selectedValues.length > 0;

    return (
        <div ref={rootRef} className={cn("relative", className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={cn(
                        "text-sm font-medium leading-none mb-2 block",
                        error ? "text-destructive" : "text-foreground"
                    )}
                >
                    {label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <button
                    ref={(node) => {
                        triggerRef.current = node;
                        if (typeof ref === "function") ref(node);
                        else if (ref) ref.current = node;
                    }}
                    id={selectId}
                    type="button"
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-xl border border-paper-dark bg-paper-light text-ink px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-destructive focus:ring-destructive",
                        !hasValue && "text-ink-medium"
                    )}
                    onClick={handleToggle}
                    onKeyDown={handleTriggerKeyDown}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    aria-controls={isOpen ? listboxId : undefined}
                    aria-invalid={!!error}
                    {...props}
                >
                    <span className="truncate">{displayText}</span>

                    <div className="flex items-center gap-1 flex-shrink-0">
                        {loading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}

                        {clearable && hasValue && !loading && (
                            <span
                                role="button"
                                tabIndex={-1}
                                aria-label="Clear selection"
                                onClick={handleClear}
                                className="p-0.5 rounded hover:bg-paper-dark/60 cursor-pointer"
                            >
                                <X className="h-3 w-3" />
                            </span>
                        )}

                        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </div>
                </button>

                {/* Mirror for native form submission. `multiple` is deliberately
                    not forwarded: this element exists to carry a value, and a
                    multi-select mirror would need an array React can't take
                    from a single-value control. */}
                <select
                    name={name}
                    value={multiple ? (selectedValues[0] ?? "") : (selectedValues[0] ?? "")}
                    onChange={() => {}}
                    className="sr-only"
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <option value="">Select...</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-paper-light text-ink border border-paper-dark rounded-xl shadow-lg overflow-hidden">
                        {searchable && (
                            <div className="p-2 border-b border-paper-dark/60">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-ink-medium" />
                                    <Input
                                        placeholder="Search options..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        )}

                        <ul
                            id={listboxId}
                            role="listbox"
                            aria-multiselectable={multiple || undefined}
                            className="py-1 max-h-60 overflow-auto"
                        >
                            {filteredOptions.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-ink-medium">
                                    {searchTerm ? "No options found" : "No options available"}
                                </li>
                            ) : (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={option.value}
                                        role="option"
                                        aria-selected={isSelected(option.value)}
                                        aria-disabled={option.disabled || undefined}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => handleOptionSelect(option)}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-lg mx-1 px-3 py-2 text-sm",
                                            index === activeIndex && "bg-paper-dark/60",
                                            isSelected(option.value) && "bg-terracotta text-white",
                                            option.disabled && "pointer-events-none opacity-50"
                                        )}
                                    >
                                        <span className="flex-1">{option.label}</span>
                                        {option.description && (
                                            <span className="text-xs opacity-70 ml-2">
                                                {option.description}
                                            </span>
                                        )}
                                        {multiple && isSelected(option.value) && (
                                            <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>

                        {/* A multi-select stays open between picks, so it needs
                            an explicit way out — otherwise the open list sits
                            over whatever follows it in the form. */}
                        {multiple && (
                            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-paper-dark/60 bg-paper/40">
                                <span className="text-xs text-ink-medium">
                                    {selectedValues.length} selected
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        close();
                                        triggerRef.current?.focus();
                                    }}
                                    className="text-xs font-bold text-terracotta-dark hover:text-terracotta transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {description && !error && (
                <p className="text-sm text-ink-medium mt-1">{description}</p>
            )}

            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
        </div>
    );
});

Select.displayName = "Select";

export default Select;
