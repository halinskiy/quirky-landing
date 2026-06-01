/**
 * Typed accessor for the project copy.
 *
 * Imports content/copy.json (repo root) via a relative path. Components import
 * a single typed `copy` object rather than reaching into JSON shape ad hoc.
 * Phase 2 sections read their strings from here.
 */
import copyJson from "../../content/copy.json";

export const copy = copyJson;
export type Copy = typeof copyJson;
