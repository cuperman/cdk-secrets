#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkSecretsStack } from '../lib/cdk-secrets-stack';

const app = new cdk.App();
new CdkSecretsStack(app, 'CdkSecretsStack');
