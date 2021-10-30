import i18next from 'i18next';
import * as Module from 'module';

type Func = (key: string) => string;
export interface TranslateInterface {
  k0: (key: string, dv: string) => string;

  k1: Func;

  k2: Func;

  k3: Func;

  k4: Func;

  k5: Func;

  k6: Func;

  k7: Func;

  k8: Func;

  k9: Func;

  k10: Func;

  k11: Func;

  k12: Func;

  k13: Func;

  k14: Func;

  k15: Func;

  k16: Func;

  k17: Func;

  k18: Func;

  k19: Func;

  k20: Func;

  k21: Func;

  k22: Func;

  k23: Func;

  k24: Func;

  k25: Func;

  k26: Func;

  k27: Func;

  k28: Func;

  k29: Func;

  k30: Func;

  k31: Func;

  k32: Func;

  k33: Func;

  k35: Func;

  k36: Func;

  k37: Func;

  k38: Func;

  k39: Func;

  k40: Func;

  k41: Func;

  k42: Func;

  k43: Func;

  k44: Func;

  k45: Func;

  k46: Func;

  k47: Func;

  k48: Func;

  k49: Func;

  k50: Func;

}

// @ts-ignore
class T implements TranslateInterface {
  constructor(ns: string) {
    const a = this as any;
    a.ns = ns;

    // eslint-disable-next-line
    a.t = (key: string, dv?: string): string => {
      const out = i18next.t(`${a.ns}:${key}`, dv);
      if (out) {
        if (out !== dv) {
          console.warn(`The value for key "${key}" was resolved as "${out}" and differs from the default value: "${dv}"`);
        }
        return out.split('\\n').join('\n');
      }
      return dv || '';
    };

    a.k0 = (key: string, dv: string) => a.t(key, dv);

    a.k1 = (dv: string) => a.t('k1', dv);

    a.k2 = (dv: string) => a.t('k2', dv);

    a.k3 = (dv: string) => a.t('k3', dv);

    a.k4 = (dv: string) => a.t('k4', dv);

    a.k5 = (dv: string) => a.t('k5', dv);

    a.k6 = (dv: string) => a.t('k6', dv);

    a.k7 = (dv: string) => a.t('k7', dv);

    a.k8 = (dv: string) => a.t('k8', dv);

    a.k9 = (dv: string) => a.t('k9', dv);

    a.k10 = (dv: string) => a.t('k10', dv);

    a.k11 = (dv: string) => a.t('k11', dv);

    a.k12 = (dv: string) => a.t('k12', dv);

    a.k13 = (dv: string) => a.t('k13', dv);

    a.k14 = (dv: string) => a.t('k14', dv);

    a.k15 = (dv: string) => a.t('k15', dv);

    a.k16 = (dv: string) => a.t('k16', dv);

    a.k17 = (dv: string) => a.t('k17', dv);

    a.k18 = (dv: string) => a.t('k18', dv);

    a.k19 = (dv: string) => a.t('k19', dv);

    a.k20 = (dv: string) => a.t('k20', dv);

    a.k21 = (dv: string) => a.t('k21', dv);

    a.k22 = (dv: string) => a.t('k22', dv);

    a.k23 = (dv: string) => a.t('k23', dv);

    a.k24 = (dv: string) => a.t('k24', dv);

    a.k25 = (dv: string) => a.t('k25', dv);

    a.k26 = (dv: string) => a.t('k26', dv);

    a.k27 = (dv: string) => a.t('k27', dv);

    a.k28 = (dv: string) => a.t('k28', dv);

    a.k29 = (dv: string) => a.t('k29', dv);

    a.k30 = (dv: string) => a.t('k30', dv);

    a.k31 = (dv: string) => a.t('k31', dv);

    a.k32 = (dv: string) => a.t('k32', dv);

    a.k33 = (dv: string) => a.t('k33', dv);

    a.k34 = (dv: string) => a.t('k34', dv);

    a.k35 = (dv: string) => a.t('k35', dv);

    a.k36 = (dv: string) => a.t('k36', dv);

    a.k37 = (dv: string) => a.t('k37', dv);

    a.k38 = (dv: string) => a.t('k38', dv);

    a.k39 = (dv: string) => a.t('k39', dv);

    a.k40 = (dv: string) => a.t('k40', dv);

    a.k41 = (dv: string) => a.t('k41', dv);

    a.k42 = (dv: string) => a.t('k42', dv);

    a.k43 = (dv: string) => a.t('k43', dv);

    a.k44 = (dv: string) => a.t('k44', dv);

    a.k45 = (dv: string) => a.t('k45', dv);

    a.k46 = (dv: string) => a.t('k46', dv);

    a.k47 = (dv: string) => a.t('k47', dv);

    a.k48 = (dv: string) => a.t('k48', dv);

    a.k49 = (dv: string) => a.t('k49', dv);

    a.k50 = (dv: string) => a.t('k50', dv);
  }
}

export const Translate = (module: Module | string): TranslateInterface => {
  if (typeof module === 'object' && module.constructor.name === 'Module') {
    return new T(module.filename) as TranslateInterface;
  }
  if (typeof module === 'string') {
    return new T(module) as TranslateInterface;
  }
  return new T('Unknown') as TranslateInterface;
};
