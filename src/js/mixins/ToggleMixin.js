/**
 * 状态切换工具集合
 * @module mixins/ToggleMixin
 */

module.exports = {
    toggleValues: [],
    toggleValue: null,
    toggleEvent: "click",
    /**
     * 解除状态切换绑定
     * @instance
     */
    toggleUnbind: function () {
        if (this.toggleEvent) {
            var node = ReactDOM.findDOMNode(this);
            $(node).unbind(this.toggleEvent, this.toggleHandler);
        }
    },
    /**
     * 开启状态切换绑定
     * @instance
     * @param {ReactElement} target     - 待绑定节点
     * @param {string} action           - 触发状态变更的事件类型
     * @param {array} values            - 在哪些值里切换，一般此处需要传入一个具有两个元素的数组
     */
    toggleAction: function (target, action, values) {
        this.toggleUnbind();

        if (target && action) {
            var node = ReactDOM.findDOMNode(target);
            $(node).bind(action, this.toggleHandler);

            this.toggleEvent = action;

            if (typeof values == 'string') {
                values = ['', values];
            }

            this.toggleValues = values;
            this.toggleValue = typeof this.props.selected != 'undefined' ?
                (this.props.selected ? 1 : 0) :
                (this.props.defaultSelected ? 1 : 0);

            this.forceUpdate();
        }
    },
    toggleHandler: function () {
        if (!this.__isLock__) {
            this.toggle();
            this.forceUpdate();
        }
    },
    /**
     * 切换一次状态，当前props的disable为true时不生效
     * 该方法的变更，会触发一次change事件
     * @instance
     * @returns {string}
     */
    toggle: function () {
        if (!this.props.disable) {
            this.toggleValue = !this.toggleValue ? 1 : 0;

            if (this.dispatchEvent) {
                this.dispatchEvent('change', {
                    value: this.props.value,
                    selected: this.toggleValue
                });
            }
        }
        return this.getToggleResult();
    },
    /**
     * 获取当前状态值，该值为toggleAction方法中传入的数组中的一个
     * @instance
     * @returns {string}
     */
    getToggleResult: function () {
        if (typeof this.toggleValues != 'undefined') {
            return this.toggleValues[this.toggleValue] || '';
        }
        return '';
    },
    componentWillReceiveProps: function (newProps) {
        if (typeof newProps.selected != 'undefined' && (this.props.cname != 'radio' || newProps.groupValidate)) {
             this.toggleValue = newProps.selected ? 1 : 0;
        }
    },
    componentWillUnmount: function () {
        this.toggleUnbind();
    }
};