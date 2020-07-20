import {
  Model,
  Application,
  UnitStatusSeverity,
  UnitStatusSeverityString,
  Unit,
  ControllerData
} from '.';

/**
 * Utility to create a unique key for an app, unit, machine, etc. by combining
 * a distinguising identifier from the resource with the name of its controller
 * and the UUID of its model. It's a workaround for the fact that apps, units,
 * etc. don't have UUIDs when comming from the Juju API.
 */
export function getItemId(
  controller: string,
  modelUuid: string,
  itemId: string
): string {
  return controller + '/' + modelUuid + '/' + itemId;
}

//
// Filled types and helpers
//
// Filled types with extra information in them to replace the need to access
// related data by ids. Filled types are essentially the result of a database
// "join" on the data, reducing it to a nested structure.

export interface FilledModel extends Model {
  controller: string;
  applications: FilledApplication[];
  statusIcon: StatusIcon;
  statusSeverity: UnitStatusSeverityString;
}

export interface FilledApplication extends Application {
  charmIconUrl: string;
  /** An actual HTTP link to the web charm store */
  charmStoreUrl: string;
  units: FilledUnit[];
  statusIcon: StatusIcon;
  /** The "worst" status of its units */
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

/** Get a status icon for the given unit status severity */
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

/** Fill in unit data such as status icon and  */
export function fillUnit(unit: Unit): FilledUnit {
  return {
    statusIcon: unitStatusSeverityIcon(unit['workload-status'].current, true),
    ...unit
  };
}

export function getCharmIcon(charmUrl: string): string {
  return (
    charmUrl.replace('cs:', 'https://api.jujucharms.com/charmstore/v5/') +
    '/icon.svg'
  );
}

/** Fill in application data such as units and statuses, etc. from the ids */
export function fillApp(
  controller: ControllerData,
  appId: string
): FilledApplication {
  const app = controller.applications[appId];
  let units: FilledUnit[] = [];

  for (const unitName in controller.units) {
    const unit = controller.units[unitName];

    if (
      unit.name.startsWith(app.name) &&
      unit['model-uuid'] == app['model-uuid']
    ) {
      units.push(fillUnit(unit));
    }

    units = units.sort(
      (a, b) =>
        UnitStatusSeverity[b['workload-status'].current] -
        UnitStatusSeverity[a['workload-status'].current]
    );
  }

  // The severity for the app is the "worst" severity out of its units.
  // Note that we've already sorted them by severity so we just grab the first on in
  // the list.
  const statusSeverity = units.map(x => x['workload-status'].current)[0];

  // Convert the "charm-url" to a linke to the charm store
  let charmStoreUrl = app['charm-url'].replace('cs:', 'https://jaas.ai/');
  charmStoreUrl = charmStoreUrl.replace('~', 'u/');
  charmStoreUrl = charmStoreUrl.replace('-', '/');

  return {
    charmIconUrl: getCharmIcon(app['charm-url']),
    charmStoreUrl,
    units: units,
    statusIcon: unitStatusSeverityIcon(statusSeverity),
    statusSeverity: statusSeverity || 'active',
    ...app
  };
}

export function fillModel(
  controllerName: string,
  controller: ControllerData,
  modelId: string
): FilledModel {
  const model = controller.models[modelId];
  let apps: FilledApplication[] = [];

  for (const appName in controller.applications) {
    const app = controller.applications[appName];

    if (app['model-uuid'] == model['model-uuid']) {
      apps.push(fillApp(controller, appName));
    }

    apps = apps.sort(
      (a, b) =>
        UnitStatusSeverity[b.statusSeverity] -
        UnitStatusSeverity[a.statusSeverity]
    );
  }

  const statusSeverity = apps.map(x => x.statusSeverity)[0];

  return {
    statusSeverity: statusSeverity || 'active',
    statusIcon: unitStatusSeverityIcon(statusSeverity),
    applications: apps,
    controller: controllerName,
    ...model
  };
}
