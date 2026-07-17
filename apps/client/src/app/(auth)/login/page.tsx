import { LoginPage } from '@/domains/auth/login/LoginPage';
import { AUTH_REQUIRED_REASON, normalizeAuthReturnTo } from '@/shared/auth/auth-return-to';

type PageProps = Readonly<{
  searchParams: Promise<{
    reason?: string | string[];
    returnTo?: string | string[];
  }>;
}>;

const getFirstSearchParam = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const reason = getFirstSearchParam(params.reason);
  const returnTo = normalizeAuthReturnTo(getFirstSearchParam(params.returnTo));

  return <LoginPage isAuthRequired={reason === AUTH_REQUIRED_REASON} returnTo={returnTo} />;
};

export default Page;
