
import { type LayoutTemplate, type LayoutTemplateObject } from '../schema';

export type LayoutTemplateWithObjects = LayoutTemplate & {
  objects: LayoutTemplateObject[];
};

export declare function getLayoutTemplates(): Promise<LayoutTemplateWithObjects[]>;
