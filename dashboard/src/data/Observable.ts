type Callback<T> = (data: T) => void;

export class Observable<T> {
    private observers: Callback<T>[] = [];

    public subscribe(observer: Callback<T>): void {
        this.observers.push(observer);
    }

    public unsubscribe(observer: Callback<T>): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    protected notify(data: T): void {
        this.observers.forEach(observer => observer(data));
    }
}