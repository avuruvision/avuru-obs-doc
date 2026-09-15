/** Published chart used by the installation examples. Update with a verified release. */
export const CHART_VERSION = '0.16.0';
export const HELM_INSTALL = `helm install avuruobs oci://ghcr.io/avuruvision/charts/avuruobs \\\n  --version ${CHART_VERSION} -n avuruobs --create-namespace`;
export const UI_PORT_FORWARD =
  'kubectl -n avuruobs port-forward svc/avuruobs-ui 8080:80';
