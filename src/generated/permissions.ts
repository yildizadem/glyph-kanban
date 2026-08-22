import "./.glyph-runtime/glyph-bootstrap";

export function is_admin(role: string): boolean {
  const __m0 = role;
  switch (__m0) {
    case "Admin": {
      return true;
    }
    default: {
      return false;
    }
  }
}

export function is_reporter(role: string): boolean {
  const __m1 = role;
  switch (__m1) {
    case "Reporter": {
      return true;
    }
    default: {
      return false;
    }
  }
}

export function is_assignee(role: string): boolean {
  const __m2 = role;
  switch (__m2) {
    case "Assignee": {
      return true;
    }
    default: {
      return false;
    }
  }
}

export function can_view_admin_metrics(role: string): boolean {
  const __m3 = role;
  switch (__m3) {
    case "Admin": {
      return true;
    }
    default: {
      return false;
    }
  }
}

export function can_create_card(role: string): boolean {
  const __m4 = role;
  switch (__m4) {
    case "Admin": {
      return true;
    }
    case "Reporter": {
      return true;
    }
    default: {
      return false;
    }
  }
}

export function can_edit_card(role: string, card_reporter_id: string, card_assignee_id: string, current_user_id: string): boolean {
  const __m5 = role;
  switch (__m5) {
    case "Admin": {
      return true;
    }
    case "Reporter": {
      const __m6 = (card_reporter_id === current_user_id);
      switch (__m6) {
        case true: {
          return true;
        }
        case false: {
          return false;
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    case "Assignee": {
      const __m7 = (card_assignee_id === current_user_id);
      switch (__m7) {
        case true: {
          return true;
        }
        case false: {
          return false;
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    default: {
      return false;
    }
  }
}

export function can_delete_card(role: string, card_reporter_id: string, current_user_id: string): boolean {
  const __m8 = role;
  switch (__m8) {
    case "Admin": {
      return true;
    }
    case "Reporter": {
      const __m9 = (card_reporter_id === current_user_id);
      switch (__m9) {
        case true: {
          return true;
        }
        case false: {
          return false;
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    default: {
      return false;
    }
  }
}

export function can_move_card_status(role: string, card_reporter_id: string, card_assignee_id: string, current_user_id: string): boolean {
  const __m10 = role;
  switch (__m10) {
    case "Admin": {
      return true;
    }
    case "Assignee": {
      const __m11 = (card_assignee_id === current_user_id);
      switch (__m11) {
        case true: {
          return true;
        }
        case false: {
          return false;
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    case "Reporter": {
      const __m12 = (card_reporter_id === current_user_id);
      switch (__m12) {
        case true: {
          return true;
        }
        case false: {
          return false;
        }
        default: throw new Error("non-exhaustive match");
      }
    }
    default: {
      return false;
    }
  }
}

export function can_reassign_card(role: string): boolean {
  const __m13 = role;
  switch (__m13) {
    case "Admin": {
      return true;
    }
    case "Reporter": {
      return true;
    }
    default: {
      return false;
    }
  }
}
