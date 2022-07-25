/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  // throw new Error('Not implemented');
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  // throw new Error('Not implemented');
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  // throw new Error('Not implemented');
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class cssSelector {
  constructor() {
    this.cssElem = '';
    this.cssClass = '';
    this.cssId = '';
    this.cssAttr = '';
    this.cssPseudoCl = '';
    this.cssPseudoEl = '';
    this.cssTemp = '';
  }

  element(value) {
    if (this.cssElem) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (
      this.cssClass || this.cssId || this.cssAttr
      || this.cssPseudoEl || this.cssPseudoCl
    ) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.cssElem = `${value}`;
    return this;
  }

  id(value) {
    if (this.cssId) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    if (this.cssClass || this.cssAttr
      || this.cssPseudoEl || this.cssPseudoCl) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.cssId = `#${value}`;
    return this;
  }

  class(value) {
    if (this.cssAttr || this.cssPseudoEl || this.cssPseudoCl) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.cssClass += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.cssPseudoEl || this.cssPseudoCl) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.cssAttr += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.cssPseudoEl) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.cssPseudoCl += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.cssPseudoEl) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.cssPseudoEl = `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.cssTemp = [selector1.stringify(), combinator, selector2.stringify()].join(' ');
    return this;
  }

  stringify() {
    return [this.cssTemp, this.cssElem, this.cssId, this.cssClass, this.cssAttr, this.cssPseudoCl, this.cssPseudoEl].join('');
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new cssSelector().element(value);
  },

  id(value) {
    return new cssSelector().id(value);
  },

  class(value) {
    return new cssSelector().class(value);
  },

  attr(value) {
    return new cssSelector().attr(value);
  },

  pseudoClass(value) {
    return new cssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new cssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new cssSelector().combine(selector1, combinator, selector2);
  },

  stringify() {
    return [this.type].join('');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
