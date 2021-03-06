import {expect} from '@oclif/test';
import * as fs from 'fs';
import * as os from 'os';
import * as sinon from 'sinon';

import ServiceConfig, {MissingConfigFileError} from '../../src/common/service-config';

describe('ServiceConfig', () => {
  let _sinon: sinon.SinonSandbox;

  beforeEach(() => {
    _sinon = sinon.createSandbox();
  });

  afterEach(() => {
    // @ts-ignore
    _sinon.restore();
  });

  it('should throw error on invalid path', () => {
    _sinon.stub(fs, 'existsSync').returns(false);
    const test_path = os.tmpdir();
    expect(ServiceConfig.loadFromPath.bind(ServiceConfig, test_path))
      .to.throw((new MissingConfigFileError(test_path)).message);
  });

  it('should return config on valid path', () => {
    _sinon.stub(fs, 'existsSync').returns(true);
    const test_path = os.tmpdir();
    const mock_config_file = {
      name: 'mock-service',
      description: 'mock description',
      version: '1.1.1',
      keywords: ['test'],
      author: ['Architect'],
      proto: 'main.proto',
      dependencies: {},
      language: 'javascript',
      license: 'Apache'
    };

    _sinon.stub(ServiceConfig, '_require').returns(mock_config_file);
    const service_config = ServiceConfig.loadFromPath(test_path);
    expect(service_config.name).to.eq(mock_config_file.name);
    expect(service_config.description).to.eq(mock_config_file.description);
    expect(service_config.version).to.eq(mock_config_file.version);
    expect(service_config.keywords).to.eq(mock_config_file.keywords);
    expect(service_config.author).to.eq(mock_config_file.author);
    expect(service_config.proto).to.eq(mock_config_file.proto);
    expect(service_config.dependencies).to.eq(mock_config_file.dependencies);
    expect(service_config.language).to.eq(mock_config_file.language);
    expect(service_config.license).to.eq(mock_config_file.license);
  });
});
