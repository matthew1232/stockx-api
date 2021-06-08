module.exports = (proxy) => {
    const splitProxy = proxy.split(':');

    if (splitProxy.length == 2) return `http://${splitProxy[0]}:${splitProxy[1]}`;
    else return `http://${splitProxy[2]}:${splitProxy[3]}@${splitProxy[0]}:${splitProxy[1]}`;
}