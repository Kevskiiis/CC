// // CommunityContext.tsx
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// // Community Object: 
// type Community = {
//   community_id: number;
//   community_name: string;
//   community_bio: string;
//   attachment_url: string;
//   role_name: string;
//   join_code: string;
//   community_public_url: string
// };

// // Shape of what the context provides:
// type CommunityContextType = {
//   communities: Community[];
//   loadCommunities: () => Promise<void>;
//   refreshCommunities: () => Promise<void>;
// };

// const CommunityContext = createContext(null);

// export function CommunityProvider({ children }: { children: ReactNode}) {
//   const [communities, setCommunities] = useState([]);
//   const [loaded, setLoaded] = useState(false);

//   async function loadCommunities() {
//     if (loaded) return; // prevents re-fetch
//     const res = await axios.get("https://your-api.com/get-user-communities");
//     setCommunities(res.data);
//     setLoaded(true);
//   }

//   function refreshCommunities() {
//     // force refetch when user joins/creates community
//     setLoaded(false);
//     loadCommunities();
//   }

//   return (
//     <CommunityContext.Provider value={{ communities, loadCommunities, refreshCommunities }}>
//       {children}
//     </CommunityContext.Provider>
//   );
// }

// export function useCommunities() {
//   const ctx = useContext(CommunityContext);
//   if (!ctx) throw new Error("useCommunities must be used inside CommunityProvider.");
//   return ctx;
// }