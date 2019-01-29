// Aquí esta nuestra función constructora, disponible globalmente
// (seteada al objeto window!)
window.EventEmitter = function () {
    this.subscribers = {};
};

(function (EE) {

    // Para ser usada como:
    // instanceOfEE.on('touchdown', cheerFn);
    EE.prototype.on = function (eventName, eventListener) {

        // Si el objeto subscribers de la instancia no tiene todavía
        // la key que matche el nombre del evento dado, creá el
        // key y asignale el valor de un arreglo vacio
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }

        // Pusheá la función listener dada al arreglo
        // localizado en el objeto subscribers de la instancia
        this.subscribers[eventName].push(eventListener);

    };

    // Para ser usado como:
    // instanceOfEE.emit('codec', 'Hey Snake, Otacon is calling!');
    EE.prototype.emit = function (eventName) {

        // Si no hay subscribers al nombre de este evento, para que molestarse
        if (!this.subscribers[eventName]) {
            return;
        }

        // Toma los argumentos restantes de nuestra función emit
        var remainingArgs = [].slice.call(arguments, 1);

        // Para cada suscriptor, llamalo con nuestros argumentos
        this.subscribers[eventName].forEach(function (listener) {
            listener.apply(null, remainingArgs);
        });

    };

})(window.EventEmitter);
