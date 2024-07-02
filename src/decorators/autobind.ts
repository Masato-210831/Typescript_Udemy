// bind(this)のためのデコレータ
export function Autobind(_: any, _2: string, descriptior: PropertyDescriptor) {
  const originalMethod = descriptior.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const newFn = originalMethod.bind(this);
      return newFn;
    },
  };
  return adjDescriptor;
}
