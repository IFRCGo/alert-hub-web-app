/*
<<<<<<< HEAD
   Both lint and build steps fail if `generated/type.tsx` is missing
=======
Both lint and build steps fail if `generated/type.tsx` is missing
>>>>>>> 7246516 (Add  Alert Table columns event, event category, region, country, admin and view details in the table)
   We generally genereate this file using graphql-codegen but graphql-codegen
   cannot always be used.
   In such cases, just copy this mock type.tsx to ensure that lint and build
   steps pass.
  NOTE: typecheck step still fails.
<<<<<<< HEAD
*/
=======
 */
>>>>>>> 7246516 (Add  Alert Table columns event, event category, region, country, admin and view details in the table)

export type Query = {
  __typename?: 'Query';
};
<<<<<<< HEAD

export type Mutation = {
  __typename?: 'Mutation';
};
=======
export type Mutation = {
  __typename?: 'Mutation';
};
>>>>>>> 7246516 (Add  Alert Table columns event, event category, region, country, admin and view details in the table)
