import LoginForm from "../login/login-form";
import { Button } from "../ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const SigninAction: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"default"} size={"lg"}>
          Sign in
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align="end"
        side="top"
        sideOffset={8}
      >
        <CardHeader className="border-b">
          <CardTitle>
            <h2>Begin your memory lane</h2>
          </CardTitle>
          <CardDescription>
            <p>
              We don&apos;t believe in passwords here, you can simply sign in
              using a username!
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <LoginForm />
        </CardContent>
      </PopoverContent>
    </Popover>
  );
};

const UnauthenticatedActions: React.FC = () => {
  return (
    <>
      <SigninAction />
    </>
  );
};

export default UnauthenticatedActions;
