import { useParams } from 'react-router-dom';

import { Proposals } from '@/contents/Proposals';

export function MyProposals() {
  const { actor: actorParam } = useParams();
  return <Proposals actAsActor={actorParam} />;
}
