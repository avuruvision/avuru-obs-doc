import React from 'react';
import Translate from '@docusaurus/Translate';
import styles from './components.module.css';

export interface ConfigBuilderProps {
  /** Schema id, e.g. "integrations/spring". */
  schema: string;
}

/**
 * Placeholder for the interactive config builder (v1 ships the static contract;
 * the schema-driven form lands in a later release). Renders the schema id so
 * contributors can wire the real builder against it.
 */
export default function ConfigBuilder({
  schema,
}: ConfigBuilderProps): React.ReactElement {
  return (
    <div className={styles.configBuilder}>
      <strong>
        <Translate id="configBuilder.title">⚙️ Config builder</Translate>
      </strong>
      <p style={{margin: '8px 0 0'}}>
        <Translate
          id="configBuilder.body"
          values={{schema: <code>{schema}</code>}}>
          {
            'Interactive builder for schema {schema} is coming soon. For now, copy the YAML from the example below and edit it by hand.'
          }
        </Translate>
      </p>
    </div>
  );
}
