import * as eks from 'aws-cdk-lib/aws-eks';
import { Construct } from 'constructs';
import { BaseNestedStack, StackCommonProps } from '../../construct/base-stack';

export default class addOnNestedStack extends BaseNestedStack {
  constructor(scope: Construct, id: string, commonProps: StackCommonProps, cluster: eks.Cluster) {
    super(scope, id, commonProps);
    // https://docs.aws.amazon.com/eks/latest/userguide/eks-add-ons.html
    // vpc-cni
    new eks.CfnAddon(this, 'vpc-cni', {
      addonName: 'vpc-cni',
      //addonVersion: 'v1.12.6-eksbuild.2',
      clusterName: cluster.clusterName,
      preserveOnDelete: false,
      resolveConflicts: 'OVERWRITE',
    });
    // kube-proxy
    new eks.CfnAddon(this, 'kube-proxy', {
      addonName: 'kube-proxy',
      //addonVersion: 'v1.27.1-eksbuild.1',
      clusterName: cluster.clusterName,
      preserveOnDelete: false,
      resolveConflicts: 'OVERWRITE',
    });
    // coredns
    new eks.CfnAddon(this, 'coredns', {
      addonName: 'coredns',
      //addonVersion: 'v1.10.1-eksbuild.1',
      clusterName: cluster.clusterName,
      preserveOnDelete: false,
    });
    // ebs-csi-driver
    new eks.CfnAddon(this, 'aws-ebs-csi-driver', {
      addonName: 'aws-ebs-csi-driver',
      //addonVersion: 'v1.19.0-eksbuild.2',
      clusterName: cluster.clusterName,
      preserveOnDelete: false,
    });
    // efs-csi-driver
    new eks.CfnAddon(this, 'aws-efs-csi-driver', {
      addonName: 'aws-efs-csi-driver',
      //addonVersion: 'v1.5.8-eksbuild.1',
      clusterName: cluster.clusterName,
      preserveOnDelete: false,
    });
    // HelmChart
    // argoCD
    cluster.addHelmChart('ArgoCD', {
      chart: 'argo-cd',
      repository: 'https://argoproj.github.io/argo-helm',
      release: 'argocd',
      namespace: 'argocd',
      createNamespace: true,
      values: { tolerations: [{ key: 'dedicated', operator: 'Exists', effect: 'NO_SCHEDULE' }] },
    });
    // Metric Server
    cluster.addHelmChart('MetricServer', {
      chart: 'metrics-server',
      repository: 'https://kubernetes-sigs.github.io/metrics-server/',
      release: 'metrics-server',
      namespace: 'kube-system',
    });
  }
}
