import Api from '../../base';

export default class BidsApi extends Api {
    // TODO!
    async getBids(options = {}) {}

    async updateBid(options = {}) {
        const { amount, variantID, chainId } = options;
        const expiresAt = moment().add(30, 'days').utc().format();

        try {
            if (!amount || !variantID || !chainId) {
                throw new Error('Invalid amount, chainId, and/or variant id!');
            }
            if (!this.bearer) {
                throw new Error('Please login first!');
            }

            const res = await this.axios({
                method: 'POST',
                url: 'https://stockx.com/api/portfolio?a=bid',
                headers: {
                    host: 'stockx.com',
                    origin: 'https://stockx.com',
                    authorization: `Bearer ${this.bearer}`,
                },
                data: {
                    PortfolioItem: {
                        localAmount: amount,
                        skuUuid: variantID,
                        localCurrency: this.currency,
                        expiresAt,
                        chainId,
                    }
                }
            });

            const { status } = res;
            if (!status || (status && status !== 200)) {
                const err = new Error('Invalid status code!');
                err.status = status || 404;
                throw err;
            }

            const { data: { PortfolioItem: { chainId: id }} } = res;

            return { id };
        } catch (error) {

        }

    }

    async placeBid(options = {}) {
        const { amount, variantID } = options;
        const expiresAt = moment().add(30, 'days').utc().format();

        try {
            if (!amount || !variantID) {
                throw new Error('Invalid amount and/or variant id!');
            }

            if (!this.bearer) {
                throw new Error('Please login first!');
            }

            const res = await this.axios({
                method: 'POST',
                url: 'https://stockx.com/api/portfolio?a=bid',
                headers: {
                    host: 'stockx.com',
                    origin: 'https://stockx.com',
                    authorization: `Bearer ${this.bearer}`,
                },
                data: {
                    PortfolioItem: {
                        localAmount: amount,
                        skuUuid: variantID,
                        localCurrency: this.currency,
                        expiresAt,
                    },
                }
            });

            const { status } = res;

            if (!status || (status && status !== 200)) {
                const err = new Error('Invalid response code!');
                err.status = status || 404;
                throw err;
            }

            const { data: { PortfolioItem: { chainId: id }} } = res;

            return { id };
        } catch (error) {
            const err = new Error('Unable to place bid!');
            err.status = error.status || 404;
            throw err;
        }
    }

    // TODO!
    async removeBid(options = {}) {}
}