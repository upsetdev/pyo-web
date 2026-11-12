// The API reference gives every /ops action its own page. Pyo's spec has one
// `POST /ops` whose body is a `oneOf` of actions; from it, this derives:
// - "pyo": the spec without that `POST /ops`, for the plain endpoints;
// - "op-<name>": one document per action, with only `POST /ops` and that
//   action's body.
// The spec stays the single source: `bun run sync-docs` generates the pages
// from these documents, and the pages derive the same documents in the
// browser. Plain JSON in, plain JSON out, so both sides can use it.

// biome-ignore lint/suspicious/noExplicitAny: OpenAPI documents are loose JSON.
type Json = any;

export const OPS_PATH = "/ops";
/** The sidebar folder of actions without `x-tags`. */
export const FALLBACK_TAG = "Actions";
export const BASE_ID = "pyo";
export const opDocumentId = (name: string) => `op-${name}`;

const resolve = (spec: Json, value: Json): Json => {
  if (!value || typeof value.$ref !== "string") return value;
  const path = value.$ref.replace(/^#\//, "").split("/");
  return resolve(
    spec,
    path.reduce((node: Json, key: string) => node?.[key], spec),
  );
};

export interface OpVariant {
  /** The `op` value, like scaleService. */
  name: string;
  title: string;
  tags: string[];
  /** The variant as written in the spec: usually a `$ref`. */
  schema: Json;
  resolved: Json;
}

/** scaleService -> Scale service; titles with spaces stay as they are. */
export const humanize = (s: string) =>
  /\s/.test(s)
    ? s
    : s
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .replace(/^./, (c) => c.toUpperCase());

function opsOperation(spec: Json): Json | undefined {
  return spec?.paths?.[OPS_PATH]?.post;
}

/** The actions of `POST /ops`, in the spec's order. Empty when it has none. */
export function opVariants(spec: Json): OpVariant[] {
  const post = opsOperation(spec);
  const body = resolve(spec, post?.requestBody);
  const schema = resolve(spec, body?.content?.["application/json"]?.schema);
  const variants: Json[] = schema?.oneOf ?? [];
  const key: string = schema?.discriminator?.propertyName ?? "op";
  const byRef = new Map<string, string>(
    Object.entries(schema?.discriminator?.mapping ?? {}).map(([k, v]) => [
      v as string,
      k,
    ]),
  );
  return variants.flatMap((variant) => {
    const resolved = resolve(spec, variant);
    const prop = resolve(spec, resolved?.properties?.[key]);
    const name: string | undefined =
      prop?.const ?? prop?.enum?.[0] ?? byRef.get(variant?.$ref);
    if (!name) return [];
    const tags: string[] = Array.isArray(resolved?.["x-tags"])
      ? resolved["x-tags"]
      : [];
    return [
      {
        name,
        title: humanize(resolved?.title ?? name),
        tags: tags.length ? tags : [FALLBACK_TAG],
        schema: variant,
        resolved,
      },
    ];
  });
}

/** The spec without `POST /ops`, when that is a `oneOf` of actions. */
export function baseDocument(spec: Json): Json {
  if (opVariants(spec).length === 0) return spec;
  const { post: _, ...rest } = spec.paths[OPS_PATH];
  const paths = { ...spec.paths };
  if (Object.keys(rest).some((k) => k !== "parameters" && k !== "summary"))
    paths[OPS_PATH] = rest;
  else delete paths[OPS_PATH];
  return { ...spec, paths };
}

/** A document with only `POST /ops`, for the action `name`. */
export function opDocument(spec: Json, name: string): Json | undefined {
  const variant = opVariants(spec).find((v) => v.name === name);
  if (!variant) return undefined;
  const post = opsOperation(spec);
  const known = new Map<string, Json>(
    (spec.tags ?? []).map((t: Json) => [t.name, t]),
  );
  return {
    ...spec,
    tags: variant.tags.map((t) => known.get(t) ?? { name: t }),
    paths: {
      [OPS_PATH]: {
        post: {
          ...post,
          operationId: variant.name,
          summary: variant.title,
          description: variant.resolved?.description ?? post.description,
          tags: variant.tags,
          "x-pyo-access":
            variant.resolved?.["x-pyo-access"] ?? post["x-pyo-access"],
          requestBody: {
            required: true,
            content: { "application/json": { schema: variant.schema } },
          },
        },
      },
    },
  };
}

/** Every document the reference is built from, by ID. */
export function referenceDocuments(spec: Json): Record<string, Json> {
  return Object.fromEntries(
    [BASE_ID, ...opVariants(spec).map((v) => opDocumentId(v.name))].map(
      (id) => [id, referenceDocument(spec, id)],
    ),
  );
}

/** One document by ID, as the pages ask for it. */
export function referenceDocument(spec: Json, id: string): Json | undefined {
  if (id === BASE_ID) return baseDocument(spec);
  if (id.startsWith("op-")) return opDocument(spec, id.slice(3));
  return undefined;
}
