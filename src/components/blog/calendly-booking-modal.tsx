"use client";

import { useState, useCallback } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  ExternalLink,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCalendly } from "./calendly-context";
import type { CalendlyAvailableTime } from "@/types/calendly";

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

type BookingStep = "calendar" | "time" | "form" | "redirect";

export function CalendlyBookingModal() {
  const { config, isModalOpen, closeModal } = useCalendly();

  const [step, setStep] = useState<BookingStep>("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<CalendlyAvailableTime[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [schedulingUrl, setSchedulingUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    closeModal();
    // Reset after animation
    setTimeout(() => {
      setStep("calendar");
      setSelectedDate(null);
      setSelectedTime(null);
      setFormData({ name: "", email: "", company: "", phone: "", message: "" });
      setFormErrors({});
      setSchedulingUrl(null);
      setError(null);
    }, 300);
  }, [closeModal]);

  // Fetch available times for selected date
  const fetchAvailableTimes = useCallback(
    async (date: Date) => {
      if (!config) return;

      setIsLoading(true);
      setError(null);

      try {
        const startTime = new Date(date);
        startTime.setHours(0, 0, 0, 0);

        const endTime = new Date(date);
        endTime.setHours(23, 59, 59, 999);

        const response = await fetch(
          `/api/calendly/available-times?` +
            `event_type_uri=${encodeURIComponent(config.eventTypeUri)}&` +
            `start_time=${startTime.toISOString()}&` +
            `end_time=${endTime.toISOString()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch available times");
        }

        const data = await response.json();
        setAvailableTimes(data.availableTimes || []);
      } catch (err) {
        setError("Unable to load available times. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [config]
  );

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    fetchAvailableTimes(date);
    setStep("time");
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("form");
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm() || !selectedTime || !config) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/calendly/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: config.postId,
          event_type_uri: config.eventTypeUri,
          start_time: selectedTime,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          message: formData.message || undefined,
          timezone,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Booking failed");
      }

      const data = await response.json();
      setSchedulingUrl(data.scheduling_url);
      setStep("redirect");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Booking failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (!config) return null;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-background rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-primary/10 px-6 py-4 border-b border-primary/20 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{config.ctaTitle}</h3>
                  {config.ctaDescription && (
                    <p className="text-sm text-muted-foreground">
                      {config.ctaDescription}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <AnimatePresence mode="wait">
                {/* Step 1: Calendar */}
                {step === "calendar" && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() - 1
                            )
                          )
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="font-medium">
                        {currentMonth.toLocaleDateString([], {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setCurrentMonth(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth() + 1
                            )
                          )
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-xs font-medium text-muted-foreground py-2"
                          >
                            {day}
                          </div>
                        )
                      )}
                      {generateCalendarDays().map((date, index) => (
                        <button
                          key={index}
                          type="button"
                          disabled={!date || isDateDisabled(date)}
                          onClick={() => date && handleDateSelect(date)}
                          className={cn(
                            "aspect-square flex items-center justify-center rounded-lg text-sm transition-colors",
                            !date && "invisible",
                            date &&
                              isDateDisabled(date) &&
                              "text-muted-foreground/50 cursor-not-allowed",
                            date &&
                              !isDateDisabled(date) &&
                              "hover:bg-primary/20 cursor-pointer",
                            selectedDate?.toDateString() ===
                              date?.toDateString() &&
                              "bg-primary text-primary-foreground"
                          )}
                        >
                          {date?.getDate()}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Timezone: {timezone}
                    </p>
                  </motion.div>
                )}

                {/* Step 2: Time Selection */}
                {step === "time" && (
                  <motion.div
                    key="time"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("calendar")}
                      className="mb-4"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>

                    <h4 className="font-medium mb-4">
                      {selectedDate?.toLocaleDateString([], {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button
                          variant="outline"
                          onClick={() =>
                            selectedDate && fetchAvailableTimes(selectedDate)
                          }
                        >
                          Try again
                        </Button>
                      </div>
                    ) : availableTimes.filter((t) => t.status === "available")
                        .length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No available times. Please select another date.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes
                          .filter((t) => t.status === "available")
                          .map((time) => (
                            <button
                              key={time.start_time}
                              type="button"
                              onClick={() => handleTimeSelect(time.start_time)}
                              className={cn(
                                "py-2 px-3 rounded-lg border text-sm transition-colors",
                                selectedTime === time.start_time
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border hover:border-primary hover:bg-primary/5"
                              )}
                            >
                              {formatTime(time.start_time)}
                            </button>
                          ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Booking Form */}
                {step === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep("time")}
                      className="mb-4"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>

                    <div className="bg-muted/50 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          {selectedDate?.toLocaleDateString([], {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          {" at "}
                          {selectedTime && formatTime(selectedTime)}
                        </span>
                      </div>
                    </div>

                    <form
                      className="space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium"
                          >
                            Name <span className="text-destructive">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={cn(
                              "w-full px-3 py-2 rounded-md border bg-background text-sm",
                              "focus:outline-none focus:ring-2 focus:ring-ring",
                              formErrors.name
                                ? "border-destructive"
                                : "border-input"
                            )}
                          />
                          {formErrors.name && (
                            <p className="text-xs text-destructive">
                              {formErrors.name}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium"
                          >
                            Email <span className="text-destructive">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={cn(
                              "w-full px-3 py-2 rounded-md border bg-background text-sm",
                              "focus:outline-none focus:ring-2 focus:ring-ring",
                              formErrors.email
                                ? "border-destructive"
                                : "border-input"
                            )}
                          />
                          {formErrors.email && (
                            <p className="text-xs text-destructive">
                              {formErrors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="company"
                            className="text-sm font-medium"
                          >
                            Company
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        <div className="space-y-1">
                          <label
                            htmlFor="phone"
                            className="text-sm font-medium"
                          >
                            Phone
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label
                          htmlFor="message"
                          className="text-sm font-medium"
                        >
                          Message (optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={2}
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="What would you like to discuss?"
                        />
                      </div>

                      {error && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                          <p className="text-sm text-destructive">{error}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Continue to Calendly"
                        )}
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* Step 4: Redirect */}
                {step === "redirect" && (
                  <motion.div
                    key="redirect"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Almost there!</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Your meeting details have been saved for:
                    </p>
                    <p className="font-medium mb-4">
                      {selectedDate?.toLocaleDateString([], {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                      {" at "}
                      {selectedTime && formatTime(selectedTime)}
                    </p>

                    {schedulingUrl && (
                      <Button asChild className="mb-3">
                        <a
                          href={schedulingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Complete on Calendly
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Click to finalize your booking on Calendly
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
