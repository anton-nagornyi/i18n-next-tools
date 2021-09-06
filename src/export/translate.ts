import i18next from 'i18next';
import * as Module from 'module';

class T {
  constructor(ns: string) {
    this.ns = ns;
  }

  private readonly ns: string;

  private t = (key: string, dv?: string): string => i18next.t(`${this.ns}:${key}`, dv).split('\\n').join('\n');

  k0 = (key: string, dv: string) => this.t(key, dv);

  k1 = (dv: string) => this.t('k1', dv);

  k2 = (dv: string) => this.t('k2', dv);

  k3 = (dv: string) => this.t('k3', dv);

  k4 = (dv: string) => this.t('k4', dv);

  k5 = (dv: string) => this.t('k5', dv);

  k6 = (dv: string) => this.t('k6', dv);

  k7 = (dv: string) => this.t('k7', dv);

  k8 = (dv: string) => this.t('k8', dv);

  k9 = (dv: string) => this.t('k9', dv);

  k10 = (dv: string) => this.t('k10', dv);

  k11 = (dv: string) => this.t('k11', dv);

  k12 = (dv: string) => this.t('k12', dv);

  k13 = (dv: string) => this.t('k13', dv);

  k14 = (dv: string) => this.t('k14', dv);

  k15 = (dv: string) => this.t('k15', dv);

  k16 = (dv: string) => this.t('k16', dv);

  k17 = (dv: string) => this.t('k17', dv);

  k18 = (dv: string) => this.t('k18', dv);

  k19 = (dv: string) => this.t('k19', dv);

  k20 = (dv: string) => this.t('k20', dv);

  k21 = (dv: string) => this.t('k21', dv);

  k22 = (dv: string) => this.t('k22', dv);

  k23 = (dv: string) => this.t('k23', dv);

  k24 = (dv: string) => this.t('k24', dv);

  k25 = (dv: string) => this.t('k25', dv);

  k26 = (dv: string) => this.t('k26', dv);

  k27 = (dv: string) => this.t('k27', dv);

  k28 = (dv: string) => this.t('k28', dv);

  k29 = (dv: string) => this.t('k29', dv);

  k30 = (dv: string) => this.t('k30', dv);

  k31 = (dv: string) => this.t('k31', dv);

  k32 = (dv: string) => this.t('k32', dv);

  k33 = (dv: string) => this.t('k33', dv);

  k34 = (dv: string) => this.t('k34', dv);

  k35 = (dv: string) => this.t('k35', dv);

  k36 = (dv: string) => this.t('k36', dv);

  k37 = (dv: string) => this.t('k37', dv);

  k38 = (dv: string) => this.t('k38', dv);

  k39 = (dv: string) => this.t('k39', dv);

  k40 = (dv: string) => this.t('k40', dv);

  k41 = (dv: string) => this.t('k41', dv);

  k42 = (dv: string) => this.t('k42', dv);

  k43 = (dv: string) => this.t('k43', dv);

  k44 = (dv: string) => this.t('k44', dv);

  k45 = (dv: string) => this.t('k45', dv);

  k46 = (dv: string) => this.t('k46', dv);

  k47 = (dv: string) => this.t('k47', dv);

  k48 = (dv: string) => this.t('k48', dv);

  k49 = (dv: string) => this.t('k49', dv);

  k50 = (dv: string) => this.t('k50', dv);
}

export const Translate = (module: Module | string): T => {
  if (typeof module === 'object' && module.constructor.name === 'Module') {
    return new T(module.filename);
  }
  if (typeof module === 'string') {
    return new T(module);
  }
  return new T('Unknown');
};
