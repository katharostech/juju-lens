import {
  Model,
  Application,
  Charm,
  UnitStatusSeverity,
  UnitStatusSeverityString,
  Unit
} from '.';

//
// Filled types and helpers
//
// Filled types with extra information in them to replace the need to access
// related data by ids.
//

export interface FilledModel extends Model {
  applications: FilledApplication[];
  statusIcon: StatusIcon;
  statusSeverity: UnitStatusSeverityString;
}

export interface FilledApplication extends Application {
  charm: Charm;
  units: FilledUnit[];
  statusIcon: StatusIcon;
  // The "worst" status of its units
  statusSeverity: UnitStatusSeverityString;
}

export interface FilledUnit extends Unit {
  statusIcon: StatusIcon;
}

export interface StatusIcon {
  icon: string;
  color: string;
}

// Green check circle
const greenCheckCircle: StatusIcon = {
  icon: 'fas fa-check-circle',
  color: 'var(--q-color-positive)'
};
// Yellow ! triangle
const yellowExclamationTriangle: StatusIcon = {
  icon: 'fas fa-exclamation-triangle',
  color: 'var(--q-color-warning)'
};
// Red ! circle
const redExclamationCircle: StatusIcon = {
  icon: 'fas fa-exclamation-circle',
  color: 'var(--q-color-negative)'
};
// Green plain circle
const greenCircle: StatusIcon = {
  icon: 'fas fa-circle',
  color: 'var(--q-color-positive)'
};
// yellow plain circle
const yellowCircle: StatusIcon = {
  icon: 'fas fa-circle',
  color: 'var(--q-color-warning)'
};
// Red plain circle
const redCircle: StatusIcon = {
  icon: 'fas fa-circle',
  color: 'var(--q-color-negative)'
};

// Get a status icon for the given unit status severity
export function unitStatusSeverityIcon(
  severity: UnitStatusSeverityString,
  mini?: boolean
): StatusIcon {
  const sev = UnitStatusSeverity[severity];
  if (sev >= UnitStatusSeverity.blocked) {
    return mini ? redCircle : redExclamationCircle;
  } else if (sev >= UnitStatusSeverity.maintenance) {
    return mini ? yellowCircle : yellowExclamationTriangle;
  } else {
    return mini ? greenCircle : greenCheckCircle;
  }
}
