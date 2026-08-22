import "./.glyph-runtime/glyph-bootstrap";

export function get_next_status(current_status: string): string {
  const __m0 = current_status;
  switch (__m0) {
    case "Backlog": {
      return "Todo";
    }
    case "Todo": {
      return "InProgress";
    }
    case "InProgress": {
      return "InReview";
    }
    case "InReview": {
      return "Done";
    }
    case "Done": {
      return "Done";
    }
    default: {
      return "Backlog";
    }
  }
}

export function get_previous_status(current_status: string): string {
  const __m1 = current_status;
  switch (__m1) {
    case "Done": {
      return "InReview";
    }
    case "InReview": {
      return "InProgress";
    }
    case "InProgress": {
      return "Todo";
    }
    case "Todo": {
      return "Backlog";
    }
    case "Backlog": {
      return "Backlog";
    }
    default: {
      return "Backlog";
    }
  }
}

export function get_status_color(status: string): string {
  const __m2 = status;
  switch (__m2) {
    case "Backlog": {
      return "slate";
    }
    case "Todo": {
      return "sky";
    }
    case "InProgress": {
      return "amber";
    }
    case "InReview": {
      return "purple";
    }
    case "Done": {
      return "emerald";
    }
    default: {
      return "slate";
    }
  }
}

export function get_priority_weight(priority: string): number {
  const __m3 = priority;
  switch (__m3) {
    case "Urgent": {
      return 4;
    }
    case "High": {
      return 3;
    }
    case "Medium": {
      return 2;
    }
    case "Low": {
      return 1;
    }
    default: {
      return 0;
    }
  }
}

export function format_activity_message(user_name: string, action: string, card_title: string, detail: string): string {
  const __m4 = action;
  switch (__m4) {
    case "create": {
      return `${user_name} created card "${card_title}"`;
    }
    case "move": {
      return `${user_name} moved card "${card_title}": ${detail}`;
    }
    case "edit": {
      return `${user_name} updated card "${card_title}"`;
    }
    case "delete": {
      return `${user_name} deleted card "${card_title}"`;
    }
    case "reassign": {
      return `${user_name} reassigned "${card_title}": ${detail}`;
    }
    default: {
      return `${user_name} performed ${action} on "${card_title}"`;
    }
  }
}
