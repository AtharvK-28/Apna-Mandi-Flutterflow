import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/Button';
import Icon from 'components/AppIcon';
import { useAuth } from 'contexts/AuthContext';

/**
 * Four things were wrong with the previous version: `variant="primary"` is not
 * one of Button's variants, so that button rendered with no styling at all;
 * `icon={<Icon/>}` is not its API (`iconName` is), so neither icon appeared;
 * `text-onBackground` is not a token in this Tailwind config, so it emitted no
 * class; and "Back to Home" sent everyone to /deals — a route karigars and
 * suppliers are not allowed to open, so they bounced straight back out.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const { homeRoute, roleMeta } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-body">
      <div className="text-center max-w-md">
        <span className="inline-flex w-16 h-16 rounded-2xl bg-terracotta-light text-terracotta-dark items-center justify-center mb-5">
          <Icon name="Compass" size={30} />
        </span>

        <p className="font-display font-extrabold text-6xl text-ink/15 leading-none mb-2">404</p>

        <h1 className="font-display font-bold text-2xl text-ink mb-2">
          That page isn&apos;t here
        </h1>
        <p className="text-ink-medium mb-8 leading-relaxed">
          The link may be out of date, or the page may belong to a different kind of Apna Mandi
          account.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>

          <Button iconName="Home" iconPosition="left" onClick={() => navigate(homeRoute)}>
            {roleMeta ? `Back to ${roleMeta.label} home` : 'Back to home'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
