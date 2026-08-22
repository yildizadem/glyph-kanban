import "./.glyph-runtime/glyph-bootstrap";

export function calculate_completion_rate(total: number, completed: number): number {
  const __m0 = (total > 0);
  switch (__m0) {
    case true: {
      return ((completed / total) * 100);
    }
    case false: {
      return 0;
    }
    default: throw new Error("non-exhaustive match");
  }
}

export function calculate_cycle_time_hours(started_at_ms: number, completed_at_ms: number): number {
  const __m1 = ((started_at_ms > 0) && (completed_at_ms >= started_at_ms));
  switch (__m1) {
    case true: {
      let diff_ms = (completed_at_ms - started_at_ms);
      let hours = (diff_ms / 3600000);
      return hours;
    }
    case false: {
      return 0;
    }
    default: throw new Error("non-exhaustive match");
  }
}

export function calculate_lead_time_hours(created_at_ms: number, completed_at_ms: number): number {
  const __m2 = ((created_at_ms > 0) && (completed_at_ms >= created_at_ms));
  switch (__m2) {
    case true: {
      let diff_ms = (completed_at_ms - created_at_ms);
      let hours = (diff_ms / 3600000);
      return hours;
    }
    case false: {
      return 0;
    }
    default: throw new Error("non-exhaustive match");
  }
}

export function detect_bottleneck_warning(in_progress_count: number, in_review_count: number, wip_threshold: number): string {
  const __m3 = (in_progress_count > wip_threshold);
  switch (__m3) {
    case true: {
      return "High In-Progress WIP: Team may be multitasking or blocked";
    }
    case false: {
      const __m4 = (in_review_count > wip_threshold);
      switch (__m4) {
        case true: {
          return "Review Bottleneck: Tasks are piling up awaiting review";
        }
        case false: {
          return "Healthy Flow: Workload distribution is within optimal limits";
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    default: throw new Error("non-exhaustive match");
  }
}

export function compute_health_score(completion_rate: number, overdue_count: number, is_bottlenecked: boolean): number {
  let base_score = completion_rate;
  let penalty_overdue = (overdue_count * 5);
  let penalty_bottleneck = (() => {
    const __m5 = is_bottlenecked;
    switch (__m5) {
      case true: {
        return 15;
      }
      case false: {
        return 0;
      }
      default: throw new Error("non-exhaustive match");
    }
  })();
  let total_penalty = (penalty_overdue + penalty_bottleneck);
  let score = ((100 - total_penalty) + (base_score * 0.4));
  const __m5 = (score < 0);
  switch (__m5) {
    case true: {
      return 0;
    }
    case false: {
      const __m6 = (score > 100);
      switch (__m6) {
        case true: {
          return 100;
        }
        case false: {
          return score;
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    default: throw new Error("non-exhaustive match");
  }
}

export function is_task_overdue(due_date_ms: number, now_ms: number, is_completed: boolean): boolean {
  const __m7 = is_completed;
  switch (__m7) {
    case true: {
      return false;
    }
    case false: {
      const __m8 = ((due_date_ms > 0) && (now_ms > due_date_ms));
      switch (__m8) {
        case true: {
          return true;
        }
        case false: {
          return false;
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    default: throw new Error("non-exhaustive match");
  }
}
