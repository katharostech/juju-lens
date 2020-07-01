// import {
//   Model,
//   Application,
//   Charm,
//   UnitStatusSeverity,
//   UnitStatusSeverityString,
//   Unit
// } from '.';

// //
// // Filled types and helpers
// //
// // Filled types with extra information in them to replace the need to access
// // related data by ids.
// //

// export interface FilledModel extends Model {
//   applications: FilledApplication[];
//   statusIcon: StatusIcon;
//   statusSeverity: UnitStatusSeverityString;
// }

// export interface FilledApplication extends Application {
//   charm: Charm;
//   units: FilledUnit[];
//   statusIcon: StatusIcon;
//   // The "worst" status of its units
//   statusSeverity: UnitStatusSeverityString;
// }

// export interface FilledUnit extends Unit {
//   statusIcon: StatusIcon;
// }

// export interface StatusIcon {
//   icon: string;
//   color: string;
// }

// // Green check circle
// const greenCheckCircle: StatusIcon = {
//   icon: 'fas fa-check-circle',
//   color: 'var(--q-color-positive)'
// };
// // Yellow ! triangle
// const yellowExclamationTriangle: StatusIcon = {
//   icon: 'fas fa-exclamation-triangle',
//   color: 'var(--q-color-warning)'
// };
// // Red ! circle
// const redExclamationCircle: StatusIcon = {
//   icon: 'fas fa-exclamation-circle',
//   color: 'var(--q-color-negative)'
// };
// // Green plain circle
// const greenCircle: StatusIcon = {
//   icon: 'fas fa-circle',
//   color: 'var(--q-color-positive)'
// };
// // yellow plain circle
// const yellowCircle: StatusIcon = {
//   icon: 'fas fa-circle',
//   color: 'var(--q-color-warning)'
// };
// // Red plain circle
// const redCircle: StatusIcon = {
//   icon: 'fas fa-circle',
//   color: 'var(--q-color-negative)'
// };

// // Get a status icon for the given unit status severity
// export function unitStatusSeverityIcon(
//   severity: UnitStatusSeverityString,
//   mini?: boolean
// ): StatusIcon {
//   const sev = UnitStatusSeverity[severity];
//   if (sev >= UnitStatusSeverity.blocked) {
//     return mini ? redCircle : redExclamationCircle;
//   } else if (sev >= UnitStatusSeverity.maintenance) {
//     return mini ? yellowCircle : yellowExclamationTriangle;
//   } else {
//     return mini ? greenCircle : greenCheckCircle;
//   }
// }

// /** Fill in unit data such as status icon and  */
// export function fillUnit(unit: Unit): FilledUnit {
//   return {
//     statusIcon: unitStatusSeverityIcon(unit.status.severity, true),
//     ...unit
//   };
// }

// /** Fill in application data such as units and statuses, etc. from the ids */
// export function fillApp(
//   { units, store }: { units: Unit[]; store: Charm[] },
//   app: Application
// ): FilledApplication {
//   // Fill extra unit information for the application
//   const filledUnits = units
//     .filter(unit => unit.applicationId == app.id)
//     .map(fillUnit)
//     .sort(
//       (a, b) =>
//         UnitStatusSeverity[b.status.severity] -
//         UnitStatusSeverity[a.status.severity]
//     );

//   // The severity for the app is the "worst" severity out of its units.
//   // Note that we've already sorted them by severity so we just grab the first on in
//   // the list.
//   const statusSeverity = filledUnits.map(x => x.status.severity)[0];

//   return {
//     charm: store.filter(charm => charm.id == app.charmId)[0],
//     units: filledUnits,
//     statusIcon: unitStatusSeverityIcon(statusSeverity),
//     statusSeverity,
//     ...app
//   };
// }
