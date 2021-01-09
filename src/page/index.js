import Logger from './logger';
import DomManipulator from './dom-manipulator';
import Lopper from './lopper';
import Classifier from './classifier';

const logger = new Logger();
const domManipulator = new DomManipulator();
const classifier = new Classifier();

const lopper = new Lopper(domManipulator, classifier, logger);
lopper.init();
