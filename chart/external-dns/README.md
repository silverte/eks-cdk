# ExternalDNS

[ExternalDNS](https://github.com/kubernetes-sigs/external-dns/) synchronizes exposed Kubernetes Services and Ingresses with DNS providers.

## Installing the Chart

Before you can install the chart you will need to add the `external-dns` repo to [Helm](https://helm.sh/).

```shell
helm repo add external-dns https://kubernetes-sigs.github.io/external-dns/
```

After you've installed the repo you can install the chart.

```shell
helm upgrade --install external-dns external-dns/external-dns
```

## Configuration

The following table lists the configurable parameters of the _ExternalDNS_ chart and their default values.

| Parameter                          | Description                                                                                                                                                                                                                                                                                                           | Default                                     |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| `image.repository`                 | Image repository.                                                                                                                                                                                                                                                                                                     | `registry.k8s.io/external-dns/external-dns` |
| `image.tag`                        | Image tag, will override the default tag derived from the chart app version.                                                                                                                                                                                                                                          | `""`                                        |
| `image.pullPolicy`                 | Image pull policy.                                                                                                                                                                                                                                                                                                    | `IfNotPresent`                              |
| `imagePullSecrets`                 | Image pull secrets.                                                                                                                                                                                                                                                                                                   | `[]`                                        |
| `nameOverride`                     | Override the `name` of the chart.                                                                                                                                                                                                                                                                                     | `""`                                        |
| `fullnameOverride`                 | Override the `fullname` of the chart.                                                                                                                                                                                                                                                                                 | `""`                                        |
| `serviceAccount.create`            | If `true`, create a new `serviceaccount`.                                                                                                                                                                                                                                                                             | `true`                                      |
| `serviceAccount.annotations`       | Annotations to add to the service account.                                                                                                                                                                                                                                                                            | `{}`                                        |
| `serviceAccount.labels`            | Labels to add to the service account.                                                                                                                                                                                                                                                                                 | `{}`                                        |
| `serviceAccount.name`              | Service account to be used. If not set and `serviceAccount.create` is `true`, a name is generated using the full name template.                                                                                                                                                                                       | `""`                                        |
| `rbac.create`                      | If `true`, create the RBAC resources.                                                                                                                                                                                                                                                                                 | `true`                                      |
| `rbac.additionalPermissions`       | Additional permissions to be added to the cluster role.                                                                                                                                                                                                                                                               | `{}`                                        |
| `initContainers`                   | Add init containers to the pod.                                                                                                                                                                                                                                                                                       | `[]`                                        |
| `deploymentAnnotations`            | Annotations to add to the Deployment.                                                                                                                                                                                                                                                                                 | `{}`                                        |
| `podLabels`                        | Labels to add to the pod.                                                                                                                                                                                                                                                                                             | `{}`                                        |
| `podAnnotations`                   | Annotations to add to the pod.                                                                                                                                                                                                                                                                                        | `{}`                                        |
| `podSecurityContext`               | Security context for the pod, this supports the full [PodSecurityContext](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#podsecuritycontext-v1-core) API.                                                                                                                                       | _see values.yaml_                           |
| `shareProcessNamespace`            | If `true` enable [Process Namespace Sharing](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/)                                                                                                                                                                                       | `false`                                     |
| `securityContext`                  | Security context for the _external-dns_ container, this supports the full [SecurityContext](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#securitycontext-v1-core) API.                                                                                                                        | _see values.yaml_                           |
| `priorityClassName`                | Priority class name to use for the pod.                                                                                                                                                                                                                                                                               | `""`                                        |
| `terminationGracePeriodSeconds`    | Termination grace period for the pod.                                                                                                                                                                                                                                                                                 | `null`                                      |
| `serviceMonitor.enabled`           | If `true`, create a _Prometheus_ service monitor.                                                                                                                                                                                                                                                                     | `false`                                     |
| `serviceMonitor.namespace`         | Forced namespace for ServiceMonitor.                                                                                                                                                                                                                                                                                  | `null`                                      |
| `serviceMonitor.annotations`       | Annotations to be set on the ServiceMonitor.                                                                                                                                                                                                                                                                          | `{}`                                        |
| `serviceMonitor.additionalLabels`  | Additional labels to be set on the ServiceMonitor.                                                                                                                                                                                                                                                                    | `{}`                                        |
| `serviceMonitor.interval`          | _Prometheus_ scrape frequency.                                                                                                                                                                                                                                                                                        | `null`                                      |
| `serviceMonitor.scrapeTimeout`     | _Prometheus_ scrape timeout.                                                                                                                                                                                                                                                                                          | `null`                                      |
| `serviceMonitor.scheme`            | _Prometheus_ scrape scheme.                                                                                                                                                                                                                                                                                           | `null`                                      |
| `serviceMonitor.tlsConfig`         | _Prometheus_ scrape tlsConfig.                                                                                                                                                                                                                                                                                        | `{}`                                        |
| `serviceMonitor.metricRelabelings` | _Prometheus_ scrape metricRelabelings.                                                                                                                                                                                                                                                                                | `[]`                                        |
| `serviceMonitor.relabelings`       | _Prometheus_ scrape relabelings.                                                                                                                                                                                                                                                                                      | `[]`                                        |
| `serviceMonitor.targetLabels`      | _Prometheus_ scrape targetLabels.                                                                                                                                                                                                                                                                                     | `[]`                                        |
| `env`                              | [Environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) for the _external-dns_ container, this supports the full [EnvVar](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#envvar-v1-core) API including secrets and configmaps. | `[]`                                        |
| `livenessProbe`                    | [Liveness probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) for the _external-dns_ container, this supports the full [Probe](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#probe-v1-core) API.                                     | See _values.yaml_                           |
| `readinessProbe`                   | [Readiness probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) for the _external-dns_ container, this supports the full [Probe](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#probe-v1-core) API.                                    | See _values.yaml_                           |
| `service.annotations`              | Annotations to add to the service.                                                                                                                                                                                                                                                                                    | `{}`                                        |
| `service.port`                     | Port to expose via the service.                                                                                                                                                                                                                                                                                       | `7979`                                      |
| `extraVolumes`                     | Additional volumes for the pod, this supports the full [VolumeDevice](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#volumedevice-v1-core) API.                                                                                                                                                 | `[]`                                        |
| `extraVolumeMounts`                | Additional volume mounts for the _external-dns_ container, this supports the full [VolumeMount](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#volumemount-v1-core) API.                                                                                                                        | `[]`                                        |
| `resources`                        | Resource requests and limits for the _external-dns_ container, this supports the full [ResourceRequirements](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#resourcerequirements-v1-core) API.                                                                                                  | `{}`                                        |
| `nodeSelector`                     | Node labels for pod assignment.                                                                                                                                                                                                                                                                                       | `{}`                                        |
| `tolerations`                      | Tolerations for pod assignment, this supports the full [Toleration](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#toleration-v1-core) API.                                                                                                                                                     | `[]`                                        |
| `affinity`                         | Affinity settings for pod assignment, this supports the full [Affinity](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#affinity-v1-core) API.                                                                                                                                                   | `{}`                                        |
| `topologySpreadConstraints`        | TopologySpreadConstraint settings for pod assignment, this supports the full [TopologySpreadConstraints](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#topologyspreadconstraint-v1-core) API.                                                                                                  | `[]`                                        |
| `logLevel`                         | Verbosity of the logs, available values are: `panic`, `debug`, `info`, `warning`, `error`, `fatal`.                                                                                                                                                                                                                   | `info`                                      |
| `logFormat`                        | Formats of the logs, available values are: `text`, `json`.                                                                                                                                                                                                                                                            | `text`                                      |
| `interval`                         | The interval for DNS updates.                                                                                                                                                                                                                                                                                         | `1m`                                        |
| `triggerLoopOnEvent`               | When enabled, triggers run loop on create/update/delete events in addition of regular interval.                                                                                                                                                                                                                       | `false`                                     |
| `namespaced`                       | When enabled, external-dns runs on namespace scope. Additionally, Role and Rolebinding will be namespaced, too.                                                                                                                                                                                                       | `false`                                     |
| `sources`                          | K8s resources type to be observed for new DNS entries.                                                                                                                                                                                                                                                                | See _values.yaml_                           |
| `policy`                           | How DNS records are synchronized between sources and providers, available values are: `sync`, `upsert-only`.                                                                                                                                                                                                          | `upsert-only`                               |
| `registry`                         | Registry Type, available types are: `txt`, `noop`.                                                                                                                                                                                                                                                                    | `txt`                                       |
| `txtOwnerId`                       | TXT registry identifier.                                                                                                                                                                                                                                                                                              | `""`                                        |
| `txtPrefix`                        | Prefix to create a TXT record with a name following the pattern `prefix.<CNAME record>`.                                                                                                                                                                                                                              | `""`                                        |
| `domainFilters`                    | Limit possible target zones by domain suffixes.                                                                                                                                                                                                                                                                       | `[]`                                        |
| `provider`                         | DNS provider where the DNS records will be created, for the available providers and how to configure them see the [README](https://github.com/kubernetes-sigs/external-dns#deploying-to-a-cluster) (this can be templated).                                                                                           | `aws`                                       |
| `extraArgs`                        | Extra arguments to pass to the _external-dns_ container, these are needed for provider specific arguments (these can be templated).                                                                                                                                                                                   | `[]`                                        |
| `deploymentStrategy`               | .spec.strategy of the external-dns Deployment. Defaults to 'Recreate' since multiple external-dns pods may conflict with each other.                                                                                                                                                                                  | `{type: Recreate}`                          |
| `secretConfiguration.enabled`      | Enable additional secret configuration.                                                                                                                                                                                                                                                                               | `false`                                     |
| `secretConfiguration.mountPath`    | Mount path of secret configuration secret (this can be templated).                                                                                                                                                                                                                                                    | `""`                                        |
| `secretConfiguration.data`         | Secret configuration secret data. Could be used to store DNS provider credentials.                                                                                                                                                                                                                                    | `{}`                                        |
| `secretConfiguration.subPath`      | Sub-path of secret configuration secret (this can be templated).                                                                                                                                                                                                                                                      | `""`                                        |

## Namespaced scoped installation

external-dns supports running on a namespaced only scope, too.
If `namespaced=true` is defined, the helm chart will setup `Roles` and `RoleBindings` instead `ClusterRoles` and `ClusterRoleBindings`.

### Limited supported
Not all sources are supported in namespaced scope, since some sources depends on cluster-wide resources.
For example: Source `node` isn't supported, since `kind: Node` has scope `Cluster`.
Sources like `istio-virtualservice` only work, if all resources like `Gateway` and `VirtualService` are present in the same
namespaces as `external-dns`.

The annotation `external-dns.alpha.kubernetes.io/endpoints-type: NodeExternalIP` is not supported.

If `namespaced` is set to `true`, please ensure that `sources` my only contains supported sources (Default: `service,ingress`.

### Support matrix

| Source                 | Supported | Infos                  |
|------------------------|-----------|------------------------|
| `ingress`              | ✅         |                        |
| `istio-gateway`        | ✅         |                        |
| `istio-virtualservice` | ✅         |                        |
| `crd`                  | ✅         |                        |
| `kong-tcpingress`      | ✅         |                        |
| `openshift-route`      | ✅         |                        |
| `skipper-routegroup`   | ✅         |                        |
| `gloo-proxy`           | ✅         |                        |
| `contour-httpproxy`    | ✅         |                        |
| `service`              | ⚠️️       | NodePort not supported |
| `node`                 | ❌         |                        |
| `pod`                  | ❌         |                        |