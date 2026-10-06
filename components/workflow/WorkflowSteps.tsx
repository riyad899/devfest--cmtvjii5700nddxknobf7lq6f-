"use client";

import type { WorkflowStepId } from "@/types";
import { WORKFLOW_STEPS } from "@/lib/constants";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

interface WorkflowStepsProps {
  activeStep: WorkflowStepId;
}

export function WorkflowSteps({ activeStep }: WorkflowStepsProps) {
  const { t, language } = useLanguage();
  const activeIndex = WORKFLOW_STEPS.indexOf(activeStep);

  return (
    <nav aria-label="Workflow" className="animate-fade-up [animation-delay:80ms]">
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {WORKFLOW_STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;
          return (
            <li
              key={step}
              id={`workflow-step-${step}`}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl border bg-white p-4 transition-all duration-300",
                isActive
                  ? "border-indigo-200 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/20"
                  : "border-slate-200 hover:-translate-y-0.5 hover:shadow-md",
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold transition-colors",
                  isActive && "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30",
                  isDone && "bg-emerald-100 text-emerald-700",
                  !isActive && !isDone && "bg-slate-100 text-slate-500",
                )}
              >
                {formatNumber(index + 1, language)}
              </span>
              <div className="min-w-0">
                <p className={cn("text-sm font-semibold", isActive ? "text-slate-900" : "text-slate-700")}>
                  {t.steps[step].title}
                </p>
                <p className="truncate text-xs text-slate-500">{t.steps[step].description}</p>
              </div>
              {isActive && (
                <span aria-hidden className="absolute inset-x-4 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
